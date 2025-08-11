#!/usr/bin/env bash

set -e

ETCD_CLIENT_PORT=${ETCD_CLIENT_PORT:-2379}
MY_IP=$(hostname -I | awk '{print $1}')

watch_mode=false
if [ "$1" == "--watch" ]; then
    watch_mode=true
fi

declare -A KNOWN

if $watch_mode; then
    echo "Watching for sibling changes..."
    echo "My IP: $MY_IP"
    while true; do
        MEMBERS_JSON=$(etcdctl --endpoints "http://127.0.0.1:${ETCD_CLIENT_PORT}" member list -w json 2>/dev/null || true)

        SIBLINGS=$(echo "$MEMBERS_JSON" | \
            grep -oP '"peerURLs":\["http://\K[0-9.]+(?=:[0-9]+\"])' | \
            grep -v "$MY_IP" || true)

        declare -A CURRENT
        for ip in $SIBLINGS; do
            CURRENT["$ip"]=1
            if [ -z "${KNOWN["$ip"]}" ]; then
                echo "[+] New sibling: $ip"
            fi
        done

        for ip in "${!KNOWN[@]}"; do
            if [ -z "${CURRENT["$ip"]}" ]; then
                echo "[-] Sibling left: $ip"
            fi
        done

        KNOWN=("${CURRENT[@]}")
        unset CURRENT

        sleep 5
    done
else
    MEMBERS_JSON=$(etcdctl --endpoints "http://127.0.0.1:${ETCD_CLIENT_PORT}" member list -w json)
    echo "$MEMBERS_JSON" | \
        grep -oP '"peerURLs":\["http://\K[0-9.]+(?=:[0-9]+\"])' | \
        grep -v "$MY_IP" || echo "No siblings found"
fi

