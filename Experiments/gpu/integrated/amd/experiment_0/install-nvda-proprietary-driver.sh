#!/usr/bin/env bash

# Add the graphics driver PPA
sudo add-apt-repository ppa:graphics-drivers/ppa -y
sudo apt update

# Install the newest driver (currently 535 or newer)
sudo ubuntu-drivers autoinstall

sudo apt --fix-broken install
