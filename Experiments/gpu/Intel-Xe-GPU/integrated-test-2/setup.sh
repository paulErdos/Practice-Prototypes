#!/bin/bash
# Install dependencies for Vulkan compute on Linux
sudo apt update
sudo apt install -y \
    build-essential \
    cmake \
    libvulkan-dev \
    vulkan-tools \
    libpng-dev \
    glslang-tools

echo "Vulkan development setup complete."