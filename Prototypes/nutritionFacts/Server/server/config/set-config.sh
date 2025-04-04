#!/usr/bin/bash

if [[ -z "${SERVER_HOST_IP}" ]]; then echo "Error: Set SERVER_HOST_IP"; exit 1; fi
if [[ -z "${SERVER_HOST_PORT}" ]]; then echo  "Error: Set SERVER_HOST_PORT"; exit 1; fi

sed -i "s,THE_HOST,$SERVER_HOST_IP," default.toml
sed -i "s,THE_PORT,$SERVER_HOST_PORT," default.toml

