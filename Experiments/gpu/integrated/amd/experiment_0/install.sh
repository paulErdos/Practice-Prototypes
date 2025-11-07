#!/usr/bin/env bash

#sudo apt install amdgpu-pro

# Ubuntu 22.04 / 24.04 – minimal OpenCL driver for the Radeon 680 M
#sudo apt update
#sudo apt install -y mesa-opencl-icd \
#                     clinfo                # optional, to verify
        
#pip3 install pyopencl
#pip3 install numpy
pipx install pyopencl --include-deps
