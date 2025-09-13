#!/usr/bin/python3

import socket

MCAST_GRP = '224.1.1.1'
MCAST_PORT = 5007
# regarding socket.IP_MULTICAST_TTL
# ---------------------------------
# for all packets sent, after two hops on the network the packet will not 
# be re-sent/broadcast (see https://www.tldp.org/HOWTO/Multicast-HOWTO-6.html)
MULTICAST_TTL = 2

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, MULTICAST_TTL)

import subprocess
if not (out := subprocess.run(['./where-am-i.sh'], capture_output=True, text=True)):
    exit("I can't determine my own IP")

my_ip = f'{out.stdout.strip()}'
sock.sendto(my_ip.encode(), (MCAST_GRP, MCAST_PORT))
