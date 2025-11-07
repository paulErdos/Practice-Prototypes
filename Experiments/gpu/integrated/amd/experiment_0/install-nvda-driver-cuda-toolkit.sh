#!/usr/bin/env bash

# 1️⃣ Update & install prerequisites
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential dkms linux-headers-$(uname -r)

# 2️⃣ Add NVIDIA's official repo
wget https://us.download.nvidia.com/XFree86/Linux-x86_64/535.54.03/NVIDIA-Linux-x86_64-535.54.03.run
chmod +x NVIDIA-Linux-x86_64-535.54.03.run

# 3️⃣ Run the installer (will auto‑install kernel headers, etc.)
sudo ./NVIDIA-Linux-x86_64-535.54.03.run --no-drm --dkms

# 4️⃣ Install CUDA Toolkit (optional but recommended)
#    Download the runfile for Linux x86_64
wget https://developer.download.nvidia.com/compute/cuda/12.5.0/local_installers/cuda_12.5.0_535.54.03_linux.run
chmod +x cuda_12.5.0_535.54.03_linux.run

# Run the installer – choose "Custom (Advanced)" and only install the CUDA toolkit, not the driver again
sudo ./cuda_12.5.0_535.54.03_linux.run --silent --toolkit

# 5️⃣ Add CUDA to PATH & LD_LIBRARY_PATH
echo 'export PATH=/usr/local/cuda-12.5/bin:$PATH' >> ~/.bashrc
echo 'export LD_LIBRARY_PATH=/usr/local/cuda-12.5/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc
source ~/.bashrc

# 6️⃣ Reboot to ensure kernel module loads cleanly
sudo reboot

