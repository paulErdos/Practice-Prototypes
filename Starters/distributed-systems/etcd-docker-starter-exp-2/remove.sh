#!/usr/bin/env bash

# Nuke everything
docker stop etcd-node && docker rm etcd-node
docker image ls | awk '{print  }' | egrep -vi ima | xargs docker image rm
docker container ls -a | awk '{print }' | egrep -vi conta | xargs docker container rm
