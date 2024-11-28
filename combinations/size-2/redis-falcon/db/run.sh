#!/bin/bash

mkdir -p ./data

docker run -d --name redis-falcon-combo-redis-container \
  -v "$(pwd)/data:/data" \
-p 6379:6379 redis-falcon-combo-redis-image

