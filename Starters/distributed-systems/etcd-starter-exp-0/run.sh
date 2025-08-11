#!/usr/bin/env bash

docker run -d --net=host \
    -e SUBNET_PREFIX=192.168.1 \
    --name etcd-node \
    etcd-autodiscovery

