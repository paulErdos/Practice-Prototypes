#!/usr/bin/env bash

sudo apt --fix-broken install
sudo apt install --reinstall intel-opencl-icd ocl-icd-opencl-dev
clinfo
