#!/usr/bin/env bash

# show all block devices with capacity and mountpoint
set -euo pipefail

echo "Device      Size   Type  Mountpoint"
echo "-------------------------------------"
lsblk -o NAME,SIZE,TYPE,MOUNTPOINT
