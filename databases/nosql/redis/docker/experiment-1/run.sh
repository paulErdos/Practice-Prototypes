#!/bin/bash

mkdir -p ./data

docker run -d --name redis-container \
  -v "$(pwd)/data:/data" \
  -p 6379:6379 redis-image

