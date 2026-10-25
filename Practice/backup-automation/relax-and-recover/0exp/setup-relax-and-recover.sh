#!/usr/bin/env bash

set -euo pipefail

CONFIG_FILE="local.conf"

echo "Generating Relax-and-Recover (ReaR) configuration..."

# Write the ReaR configuration file locally
cat << 'EOF' > "$CONFIG_FILE"
# Relax-and-Recover (ReaR) Configuration
# Generated for system backup and smaller disk migration/clone support

# Output type for the rescue system (ISO image)
OUTPUT=ISO

# Backup method (NETFS for local/network filesystem storage)
BACKUP=NETFS

# Directory where the backup archive and ISO will be stored
# (Ensure this path has enough free space or points to your backup target)
BACKUP_URL=file://$PWD/  # Or adjust to your desired backup destination path

# Enable automatic growth/adjustment features where supported
AUTOINCREASE=y

# Set compression level for faster or smaller backups (gzip, lzma, or zstd)
BACKUP_PROG_COMPRESS_OPTIONS="--zstd"

EOF

echo "--------------------------------------------------------"
echo "Success! Configuration file '$CONFIG_FILE' has been created."
echo "To install this configuration into ReaR, run the following command in your shell:"
echo ""
echo "  sudo mkdir -p /etc/rear"
echo "  sudo mv ./$CONFIG_FILE /etc/rear/local.conf"
echo "  sudo chown root:root /etc/rear/local.conf"
echo "  sudo chmod 600 /etc/rear/local.conf"
echo "--------------------------------------------------------"
