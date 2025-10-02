#!/usr/bin/env bash

wget -qO - https://apt.repos.intel.com/oneapi/gpg.key | sudo apt-key add -
sudo sh -c 'echo "deb https://apt.repos.intel.com/oneapi all main" > /etc/apt/sources.list.d/intel-oneapi.list'
sudo apt update
sudo apt install intel-oneapi-basekit

