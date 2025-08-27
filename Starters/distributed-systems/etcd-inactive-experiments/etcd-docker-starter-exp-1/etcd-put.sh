#!/usr/bin/bash

[ $# -ne 2 ] && echo "Usage: $0 key 'values values'" && exit 1

docker exec -it etcd-node etcdctl --endpoints=localhost:2379 put $1 "$2"

