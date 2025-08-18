#!/usr/bin/env bash

#    --rm \
docker run -d \
    --net=host \
    -e SUBNET_PREFIX=192.168.1 \
    -e MY_IP="$(ifconfig | grep 192 | awk '{ print $2 }')" \
    --name etcd-node \
    etcd-autodiscovery

