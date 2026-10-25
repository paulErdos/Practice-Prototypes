#!/usr/bin/env bash

set -euo pipefail

# ------------------------------------------------------------
# 1. Safety: Must run as root (ReaR recovery requires it)
# ------------------------------------------------------------
if [[ $EUID -ne 0 ]]; then
    echo "Error: This script must be run as root." >&2
    exit 1
fi

# ------------------------------------------------------------
# 2. Force Migration Mode.
#    Even if ReaR might otherwise skip dialogs, we want them
#    because the target disk is smaller and needs mapping.
# ------------------------------------------------------------
export MIGRATION_MODE="true"

# ------------------------------------------------------------
# 3. Enable autoresize for ALL active partitions.
#    By default, ReaR only resizes the last partition. Setting
#    this to "true" makes it consider all partitions that can
#    be shrunk to fit the smaller disk.
# ------------------------------------------------------------
export AUTORESIZE_PARTITIONS="true"

# ------------------------------------------------------------
# 4. Allow a large shrink percentage.
#    This controls how much smaller the new disk can be
#    compared to the original. A high value (e.g., 100)
#    permits any necessary shrink.
# ------------------------------------------------------------
export AUTOSHRINK_DISK_SIZE_LIMIT_PERCENTAGE="100"

# Optional: Exclude partitions you do NOT want touched
# (e.g., boot, swap, or specific device nodes)
# export AUTORESIZE_EXCLUDE_PARTITIONS=( boot swap efi /dev/sdb3 )

# ------------------------------------------------------------
# 5. Launch recovery.
#    ReaR will detect the size mismatch, enter migration mode,
#    and – with the variables above – attempt to resize the
#    layout automatically. You will still be prompted to
#    confirm the disk mapping and the adjusted layout.
# ------------------------------------------------------------
echo "Starting ReaR recovery with migration/autoresize settings…"
rear -v recover

echo "Recovery finished. Review the log at /var/log/rear/ for details."
