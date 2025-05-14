#!/usr/bin/bash

yes | sudo apt install nginx

clear
echo "Does it look installed? ctrl c to exit"
sleep 1

systemctl status nginx
