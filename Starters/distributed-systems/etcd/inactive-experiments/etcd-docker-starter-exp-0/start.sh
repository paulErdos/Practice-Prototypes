#!/usr/bin/env bash

set -e

# Require subnet prefix
if [ -z "$SUBNET_PREFIX" ]; then
    echo "ERROR: SUBNET_PREFIX environment variable must be set (e.g. 192.168.1)"
    exit 1
fi

ETCD_PEER_PORT=${ETCD_PEER_PORT:-2380}
ETCD_CLIENT_PORT=${ETCD_CLIENT_PORT:-2379}

MY_IP=$(hostname -I | awk '{print $1}')
MY_NAME=$(hostname)

echo "Starting etcd node..."
echo "My IP: $MY_IP"
echo "Subnet prefix: $SUBNET_PREFIX"
echo "Peer port: $ETCD_PEER_PORT, Client port: $ETCD_CLIENT_PORT"

echo "Scanning for other etcd peers..."
SEEDS=()

for last_octet in $(seq 1 254); do
    ip="${SUBNET_PREFIX}.${last_octet}"
    if [ "$ip" != "$MY_IP" ]; then
        if nc -z -w 1 $ip $ETCD_PEER_PORT; then
            echo "Found etcd peer at $ip"
            SEEDS+=("${ip}=http://${ip}:${ETCD_PEER_PORT}")
        fi
    fi
done

if [ ${#SEEDS[@]} -eq 0 ]; then
    echo "No peers found. Starting new cluster..."
    INITIAL_CLUSTER="${MY_NAME}=http://${MY_IP}:${ETCD_PEER_PORT}"
else
    INITIAL_CLUSTER="${MY_NAME}=http://${MY_IP}:${ETCD_PEER_PORT},${SEEDS[*]}"
fi

echo "Initial cluster: $INITIAL_CLUSTER"

# Start sibling watcher in background
/usr/local/bin/list-siblings --watch &

# Start etcd in foreground
exec etcd \
    --name "${MY_NAME}" \
    --initial-advertise-peer-urls "http://${MY_IP}:${ETCD_PEER_PORT}" \
    --listen-peer-urls "http://${MY_IP}:${ETCD_PEER_PORT}" \
    --listen-client-urls "http://${MY_IP}:${ETCD_CLIENT_PORT}" \
    --advertise-client-urls "http://${MY_IP}:${ETCD_CLIENT_PORT}" \
    --initial-cluster "${INITIAL_CLUSTER}" \
    --initial-cluster-state new

