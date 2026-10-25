#!/usr/bin/env bash

#  mount a device given as $1
set -euo pipefail

if [[ $# -ne 1 ]]; then
    echo "Usage: $0 /dev/sdXN" >&2
    exit 1
fi

DEVICE="$1"
MOUNT_POINT="/mnt/$(basename "$DEVICE")"

# Ensure the mount point exists
sudo mkdir -p "$MOUNT_POINT"

# Mount the device (auto-detects filesystem type)
sudo mount "$DEVICE" "$MOUNT_POINT"

echo "Mounted $DEVICE at $MOUNT_POINT"
