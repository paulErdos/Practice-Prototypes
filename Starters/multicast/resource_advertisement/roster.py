#!/usr/bin/env python3

import socket
import struct
import json
import threading
import time
import subprocess
import os
import multiprocessing

MCAST_GRP = '224.1.1.1'
MCAST_PORT = 5007
MULTICAST_TTL = 2
HEARTBEAT_FREQ = 2      # seconds
EXPIRE_AFTER = 5        # seconds

# Unique node ID: use local IP
out = subprocess.run(['./where-am-i.sh'], capture_output=True, text=True)
if out.returncode != 0:
    exit("Cannot determine own IP")
node_id = out.stdout.strip()

peers = {}  # {peer_id: {"cpu_free": x, "gpu_free": y, ...}}
lock = threading.Lock()

# Detect CPU and GPU resources
total_cpu = multiprocessing.cpu_count()
cpu_free = total_cpu

def detect_gpus():
    try:
        out = subprocess.run(
            ["nvidia-smi", "--query-gpu=index,memory.total", "--format=csv,noheader,nounits"],
            capture_output=True, text=True
        )
        gpus = [line.split(",") for line in out.stdout.strip().split("\n") if line]
        return len(gpus)
    except FileNotFoundError:
        return 0

total_gpu = detect_gpus()
gpu_free = total_gpu

# Setup receiver socket
recv_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
recv_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
recv_sock.bind(('', MCAST_PORT))
mreq = struct.pack("4sl", socket.inet_aton(MCAST_GRP), socket.INADDR_ANY)
recv_sock.setsockopt(socket.IPPROTO_IP, socket.IP_ADD_MEMBERSHIP, mreq)

def receive_heartbeats():
    while True:
        data, _ = recv_sock.recvfrom(10240)
        try:
            hb = json.loads(data.decode())
            peer_id = hb['id']
            with lock:
                peers[peer_id] = {
                    "cpu_total": hb.get("cpu_total", 0),
                    "cpu_free": hb.get("cpu_free", 0),
                    "gpu_total": hb.get("gpu_total", 0),
                    "gpu_free": hb.get("gpu_free", 0),
                    "last_seen": time.time()
                }
        except Exception as e:
            print("Receive error:", e)

def send_heartbeats():
    global cpu_free, gpu_free
    send_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    send_sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, MULTICAST_TTL)
    while True:
        heartbeat = {
            "id": node_id,
            "cpu_total": total_cpu,
            "cpu_free": cpu_free,
            "gpu_total": total_gpu,
            "gpu_free": gpu_free
        }
        send_sock.sendto(json.dumps(heartbeat).encode(), (MCAST_GRP, MCAST_PORT))
        time.sleep(HEARTBEAT_FREQ)

# Expire old peers
def expire_peers():
    while True:
        time.sleep(HEARTBEAT_FREQ)
        now = time.time()
        with lock:
            expired = [pid for pid, info in peers.items() if now - info["last_seen"] > EXPIRE_AFTER]
            for pid in expired:
                del peers[pid]
            # Display current roster
            roster = {pid: {"cpu_free": info["cpu_free"], "gpu_free": info["gpu_free"]} for pid, info in peers.items()}
            print(f"Active peers: {roster}")

# Start threads
threading.Thread(target=receive_heartbeats, daemon=True).start()
threading.Thread(target=send_heartbeats, daemon=True).start()
threading.Thread(target=expire_peers, daemon=True).start()

# Keep main thread alive
while True:
    time.sleep(1)

