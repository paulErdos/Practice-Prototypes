#!/usr/bin/env bash

echo 'Attempting to install relax-and-recover'
set -euo pipefail

# Check if Relax-and-Recover (rear) is already installed
if command -v rear &>/dev/null; then
    echo "Already installed"
    exit 0
fi

# Detect package manager and install rear
if command -v apt-get &>/dev/null; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y rear genisoimage syslinux extlinux
elif command -v dnf &>/dev/null; then
    dnf install -y rear genisoimage syslinux
elif command -v yum &>/dev/null; then
    yum install -y rear genisoimage syslinux
elif command -v pacman &>/dev/null; then
    pacman -Syu --noconfirm rear cdrtools syslinux
else
    echo "Error: Unsupported package manager. Please install relax-and-recover manually." >&2
    exit 1
fi

echo "Relax-and-Recover installed successfully."
