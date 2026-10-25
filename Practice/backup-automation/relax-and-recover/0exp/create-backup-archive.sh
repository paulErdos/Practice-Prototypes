#!/usr/bin/env bash

./setup-relax-and-recover.sh

set -euo pipefail

# Ensure the user knows how to use
if [ $# -ne 4 ]; then
    echo 'usage: create-backup-archive.sh /path/to/iso/destination/eg/desktop /path/to/recovery/script.sh /path/to/list-drives-scipt.sh /path/to/drive/mounter/script.sh'
    exit 1
fi

# Create config
./setup-relax-and-recover.sh $1 $2 $3 $4

# Ensure the script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "Error: This script must be run as root." >&2
   exit 1
fi

echo "========================================================"
echo "Starting Relax-and-Recover (ReaR) Backup Process"
echo "========================================================"

# Check if ReaR configuration exists
if [[ ! -f /etc/rear/local.conf ]]; then
    echo "Error: /etc/rear/local.conf not found. Please run the setup script first." >&2
    exit 1
fi

# Display active ReaR configuration info
echo "Loaded configuration summary from /etc/rear/local.conf:"
grep -E '^(OUTPUT|BACKUP|BACKUP_URL)=' /etc/rear/local.conf || true
echo "--------------------------------------------------------"

# Execute ReaR backup workflow
# (Creates the rescue ISO image and the full system backup archive)
echo "Executing 'rear mkbackup'..."
rear -v mkbackup

echo "========================================================"
echo "Backup completed successfully!"
echo "Your rescue image and backup archives are now stored at"
echo "the destination specified in your BACKUP_URL configuration."
echo "--------------------------------------------------------"
echo "Next Steps:"
echo "1. Locate your generated rescue ISO image."
echo "2. Boot your smaller destination drive using the rescue media."
echo "3. Run 'rear recover' on the destination system to restore."
echo "========================================================"
