#!/usr/bin/env bash


set -euo pipefail

# Ensure the user knows how to use
if [ $# -ne 1 ]; then
    echo 'usage: ./create.sh /path/to/non/root/user/desktop'
    exit 1
fi

# Ensure the script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "Error: This script must be run as root." >&2
   exit 1
fi


./create-backup-archive.sh "$1" recover-to-disk.sh list-drives.sh mount-drive.sh
