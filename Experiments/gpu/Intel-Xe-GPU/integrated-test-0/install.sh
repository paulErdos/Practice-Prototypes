#!/bin/bash
set -e

sudo apt update
sudo apt install ocl-icd-opencl-dev opencl-headers

sudo apt install opencl-headers ocl-icd-opencl-dev
sudo apt install clhpp-dev  # may be available in newer versions


# Ubuntu/Debian example
sudo apt update
sudo apt install -y g++ ocl-icd-opencl-dev libopencl-clang-19-dev 

