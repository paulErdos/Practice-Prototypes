#!/usr/bin/env bash

if which ip >/dev/null 2>&1; then
    my_ip=$(ip route get 1.1.1.1 | awk '{print $7; exit}' 2>/dev/null)
else
    my_ip=$(ifconfig | awk '/inet / && !/127.0.0.1/ {print $2}' | head -1)
fi

echo $my_ip
