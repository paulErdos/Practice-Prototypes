#!/usr/bin/env bash

# Ensure the user knows how to use
if [ $# -ne 4 ]; then
    echo 'usage: setup-relax-and-recover.sh /path/to/iso/destination/eg/desktop /path/to/recovery/script.sh /path/to/list-drives-scipt.sh /path/to/drive/mounter/script.sh'
    exit 1
fi

iso_and_archive_destination=$1
recovery_script_path=$2

set -euo pipefail

CONFIG_FILE="local.conf"

echo "Generating Relax-and-Recover (ReaR) configuration..."

# Write the ReaR configuration file locally
cat << 'EOF' > "$CONFIG_FILE"
# Relax-and-Recover (ReaR) Configuration
# Generated for system backup and smaller disk migration/clone support

# Output type for the rescue system (ISO image)
OUTPUT=ISO

# Parens: it needs this as an array.
PRE_RECOVERY_SCRIPT= ( $recovery_script_path )

# This array has data already
COPY_AS_IS+= (
# Backup method (NETFS for local/network filesystem storage)
BACKUP=NETFS

BACKUP_URL=file://$iso_and_archive_destination/
OUTPUT_URL=file://$iso_and_archive_destination/

# Enable automatic growth/adjustment features where supported
AUTOINCREASE=y

# Set compression level for faster or smaller backups (gzip, lzma, or zstd)
# BACKUP_PROG_COMPRESS_OPTIONS="--zstd"

EOF


#echo "--------------------------------------------------------"
#echo "Success! Configuration file '$CONFIG_FILE' has been created."
#echo "To install this configuration into ReaR, run the following command in your shell:"
#echo ""
#echo "  sudo mkdir -p /etc/rear"
#echo "  sudo mv ./$CONFIG_FILE /etc/rear/local.conf"
#echo "  sudo chown root:root /etc/rear/local.conf"
#echo "  sudo chmod 600 /etc/rear/local.conf"
#echo "--------------------------------------------------------"

sudo mkdir -p /etc/rear"
sudo mv ./$CONFIG_FILE /etc/rear/local.conf"
sudo chown root:root /etc/rear/local.conf"
sudo chmod 600 /etc/rear/local.conf"
