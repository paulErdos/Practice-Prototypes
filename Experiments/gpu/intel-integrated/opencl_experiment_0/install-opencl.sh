#!/usr/bin/env bash

sudo apt update
sudo apt install ocl-icd-opencl-dev intel-opencl-icd clinfo build-essential
clinfo   # should show your Intel GPU

