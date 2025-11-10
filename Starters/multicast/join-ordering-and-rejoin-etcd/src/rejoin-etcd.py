#!/usr/bin/env python3

# etcd_rejoin/etcd_manager.py
#!/usr/bin/env python3
import subprocess
import json
import logging
from typing import List, Optional
import yaml

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('etcd-rejoin')

class EtcdRejoinManager:
    def __init__(self, my_ip: str, cluster_size: int = 3, etcd_port: int = 2379):
        """
        Initialize with node's IP and cluster configuration

        Args:
            my_ip: This node's IP address
            cluster_size: Total expected members in the cluster (default: 3)
            etcd_port: Port where etcd is listening for client requests
        """
        self.my_ip = my_ip
        self.cluster_size = cluster_size
        self.etcd_port = etcd_port
        self.quorum_size = (cluster_size // 2) + 1

    def get_peer_urls(self, peer_ips: List[str]) -> str:
        """
        Construct initial cluster string from list of peer IPs

        Args:
            peer_ips: List of active peer IP addresses

        Returns:
            Initial cluster string for etcd configuration
        """
        # Format as "name=http://ip:port" where name is sequential index
        peer_urls = [f"etcd{i}=http://{ip}:2380" for i, ip in enumerate(peer_ips)]
        return ",".join(peer_urls)

    def check_service_status(self) -> bool:
        """
        Check if etcd service is running

        Returns:
            True if service is running, False otherwise
        """
        try:
            result = subprocess.run(
                ["systemctl", "is-active", "etcd"],
                capture_output=True,
                text=True
            )
            return result.returncode == 0 and result.stdout.strip() == "active"
        except Exception as e:
            logger.warning(f"Error checking service status: {e}")
            # Fallback to assume it's running if we can't check
            return True

    def stop_etcd(self) -> bool:
        """Stop the etcd service"""
        try:
            subprocess.run(["systemctl", "stop", "etcd"], check=True)
            logger.info("Successfully stopped etcd service")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to stop etcd: {e}")
            return False

    def start_etcd(self) -> bool:
        """Start the etcd service"""
        try:
            subprocess.run(["systemctl", "start", "etcd"], check=True)
            # Wait for it to be fully started
            import time
            time.sleep(2)
            logger.info("Successfully started etcd service")
            return True
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to start etcd: {e}")
            return False

    def update_config(self, new_cluster_str: str) -> bool:
        """
        Update the etcd configuration with a new initial cluster string

        Args:
            new_cluster_str: New initial cluster configuration string

        Returns:
            True if config was updated successfully
        """
        try:
            config_path = "/etc/etcd/etcd.conf.yaml"
            with open(config_path, "r") as f:
                config = yaml.safe_load(f)

            config["initial-cluster"] = new_cluster_str
            config["initial-cluster-state"] = "existing"

            # Save back to file
            with open(config_path, "w") as f:
                yaml.dump(config, f)
            logger.info("Updated etcd configuration successfully")
            return True

        except Exception as e:
            logger.error(f"Error updating etcd configuration: {e}")
            return False

    def reconstruct_cluster(self, available_peers: List[str]) -> bool:
        """
        Reconstruct the cluster with current peers

        Args:
            available_peers: List of currently active peer IP addresses

        Returns:
            True if operation was successful
        """
        # Ensure we have enough peers to form quorum
        if len(available_peers) < (self.cluster_size - 1):
            logger.warning(
                f"Insufficient peers ({len(available_peers)}) to form quorum. "
                f"Need at least {self.quorum_size-1} other members."
            )
            return False

        # Stop etcd if running
        if self.check_service_status() and not self.stop_etcd():
            logger.error("Failed to stop etcd service")
            return False

        # Construct new initial cluster configuration
        peer_urls = self.get_peer_urls(available_peers)
        if not self.update_config(peer_urls):
            return False

        # Start the service back up
        if not self.start_etcd():
            logger.error("Failed to start etcd service after reconfiguration")
            return False

        return True

    def verify_cluster(self) -> bool:
        """Verify cluster membership and health"""
        try:
            result = subprocess.run(
                ["etcdctl", "--endpoints", f"http://{self.my_ip}:{self.etcd_port}",
                 "endpoint", "health"],
                capture_output=True,
                text=True
            )
            if result.returncode != 0 or "unhealthy" in result.stdout.lower():
                logger.error("Cluster health check failed")
                return False

            # Check membership
            members = subprocess.run(
                ["etcdctl", "--endpoints", f"http://{self.my_ip}:{self.etcd_port}",
                 "member", "list"],
                capture_output=True,
                text=True
            )
            if members.returncode == 0:
                logger.info(f"Current cluster members:\n{members.stdout}")
        except Exception as e:
            logger.error(f"Error verifying cluster: {e}")
            return False

        return True

def main():
    """Command-line interface for the module"""
    import argparse
    parser = argparse.ArgumentParser(description="Etcd Node Rejoin Utility")
    parser.add_argument("--my-ip", required=True, help="This node's IP address")
    parser.add_argument("--peers", nargs="+",
                       help="List of active peer IPs (space-separated)")
    parser.add_argument("--cluster-size", type=int, default=3,
                       help="Total expected members in the cluster")

    args = parser.parse_args()

    manager = EtcdRejoinManager(args.my_ip, args.cluster_size)
    if args.peers:
        logger.info(f"Attempting to rejoin cluster with peers: {args.peers}")
        success = manager.reconstruct_cluster(args.peers)
        if success:
            if manager.verify_cluster():
                logger.info("Successfully rejoined etcd cluster")
                return 0
            else:
                logger.error("Rejoined but cluster verification failed")
                return 1
        else:
            logger.error("Failed to rejoin etcd cluster")
            return 2
    else:
        logger.warning("No peer list provided - cannot rejoin")
        parser.print_help()
        return 1

if __name__ == "__main__":
    main()

