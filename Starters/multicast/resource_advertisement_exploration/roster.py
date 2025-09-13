#!/usr/bin/env python3

import socket
import struct
import json
import threading
import time
import subprocess

MCAST_GRP = '224.1.1.1'
MCAST_PORT = 5007
MULTICAST_TTL = 2
HEARTBEAT_FREQ = 2      # seconds
EXPIRE_AFTER = 5        # seconds

# Determine our own IP using your existing script
out = subprocess.run(['./where-am-i.sh'], capture_output=True, text=True)
if out.returncode != 0:
    exit("Cannot determine own IP")
# Get just the first IP if multiple are returned
node_id = out.stdout.strip().split()[0]  # unique node ID

# Get startup timestamp
startup_time = time.time()

peers = {}  # {peer_id: {"startup_time": x, "last_seen": y}}
lock = threading.Lock()

# Setup receiver socket
recv_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
recv_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
recv_sock.bind(('', MCAST_PORT))  # receive from all interfaces

mreq = struct.pack("4sl", socket.inet_aton(MCAST_GRP), socket.INADDR_ANY)
recv_sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

def receive_heartbeats():
    while True:
        data, _ = recv_sock.recvfrom(10240)
        try:
            hb = json.loads(data.decode())
            peer_ip = hb['ip']
            peer_startup = hb['startup_time']
            with lock:
                peers[peer_ip] = {"startup_time": peer_startup, "last_seen": time.time()}
        except:
            # Fallback for old format
            peer_ip = data.decode().strip()
            with lock:
                peers[peer_ip] = {"startup_time": time.time(), "last_seen": time.time()}

def send_heartbeats():
    send_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    send_sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, MULTICAST_TTL)
    while True:
        heartbeat = {"ip": node_id, "startup_time": startup_time}
        send_sock.sendto(json.dumps(heartbeat).encode(), (MCAST_GRP, MCAST_PORT))
        time.sleep(HEARTBEAT_FREQ)

# Start receiver and sender threads
threading.Thread(target=receive_heartbeats, daemon=True).start()
threading.Thread(target=send_heartbeats, daemon=True).start()

# Main loop: expire old peers and print roster
while True:
    time.sleep(HEARTBEAT_FREQ)
    now = time.time()
    with lock:
        expired = [pid for pid, info in peers.items() if now - info["last_seen"] > EXPIRE_AFTER]
        for pid in expired:
            del peers[pid]
        print(f"Active peers: {peers}")
        # Collect all timestamps (ours + peers)
        timestamp_list = []
        for peer_ip, info in peers.items():
            if peer_ip == node_id:
                timestamp_list.append((info['startup_time'], f"me: {info['startup_time']}"))
            else:
                timestamp_list.append((info['startup_time'], f"not me: {info['startup_time']}"))
        
        # Sort by timestamp and add index
        timestamp_list.sort(key=lambda x: x[0])
        all_timestamps = [f"{i}: {label}" for i, (_, label) in enumerate(timestamp_list)]
        print(f"Timestamps: {all_timestamps}")
