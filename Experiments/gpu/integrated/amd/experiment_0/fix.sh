#!/usr/bin/env bash

# 1️⃣  Fix any broken packages that are blocking removal
sudo apt --fix-broken install -y

# 2️⃣  Now purge every NVIDIA‑related package (one command)
sudo apt purge -y '^nvidia-.*' '^libnvidia-.*'

