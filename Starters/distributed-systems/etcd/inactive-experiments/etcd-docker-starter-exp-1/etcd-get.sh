#!/usr/bin/bash

[ $# -ne 1 ] && echo "Usage: $0 key" && exit 1

docker exec -it etcd-node etcdctl --endpoints=localhost:2379 get "$1"

