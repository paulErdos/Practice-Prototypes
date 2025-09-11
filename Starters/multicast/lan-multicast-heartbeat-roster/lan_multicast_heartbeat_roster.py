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
node_id = out.stdout.strip()  # unique node ID

peers = {}  # {peer_id: last_seen_timestamp}
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
        peer_ip = data.decode().strip()
        with lock:
            peers[peer_ip] = time.time()

def send_heartbeats():
    send_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    send_sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, MULTICAST_TTL)
    while True:
        send_sock.sendto(node_id.encode(), (MCAST_GRP, MCAST_PORT))
        time.sleep(HEARTBEAT_FREQ)

# Start receiver and sender threads
threading.Thread(target=receive_heartbeats, daemon=True).start()
threading.Thread(target=send_heartbeats, daemon=True).start()

# Main loop: expire old peers and print roster
while True:
    time.sleep(HEARTBEAT_FREQ)
    now = time.time()
    with lock:
        expired = [pid for pid, t in peers.items() if now - t > EXPIRE_AFTER]
        for pid in expired:
            del peers[pid]
        print(f"Active peers: {list(peers.keys())}")
