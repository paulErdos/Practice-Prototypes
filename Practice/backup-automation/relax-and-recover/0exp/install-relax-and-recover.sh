#!/usr/bin/env bash

echo 'Attempting to install relax-and-recover'
set -euo pipefail

# Check if Relax-and-Recover (rear) is already installed
#if command -v rear &>/dev/null; then
#    echo "Already installed"
#    exit 0
#fi

sudo apt-get update
sudo apt-get install -y rear genisoimage syslinux extlinux

# Detect package manager and install rear
#if command -v apt-get &>/dev/null; then
#    export DEBIAN_FRONTEND=noninteractive
#else
#    echo "Error: Unsupported package manager. Please install relax-and-recover manually." >&2
#    exit 1
#fi

echo "Relax-and-Recover install attempted."

