#!/usr/bin/env bash

# 1️⃣  Purge everything that starts with "nvidia" or "libnvidia"
sudo apt purge -y '^nvidia-.*' '^libnvidia-.*'

# 2️⃣  Also remove the open‑driver meta‑packages if they survived
sudo apt purge -y 'nvidia-driver-*-open' 'nvidia-dkms-*-open' 'nvidia-kernel-source-*-open'

# 3️⃣  Clean up any residual config files and cached packages
sudo apt autoremove --purge -y
sudo apt clean

# 4️⃣  Verify that nothing remains
dpkg -l | grep nvidia || echo "No NVIDIA packages left"

