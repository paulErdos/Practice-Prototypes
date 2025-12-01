#!/usr/bin/env bash

SV=HelloWorld.service

# Stop
systemctl --user stop $SV

# Unlink
systemctl --user disable $SV

# Delete
sudo rm ~/.config/systemd/user/$SV

# That's it
echo Done

