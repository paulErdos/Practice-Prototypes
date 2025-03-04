#!/bin/bash

docker run \
    --name postgres-container \
    -e POSTGRES_USER=${POSTGRES_USER} \
    -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
    -e POSTGRES_DB=${POSTGRES_DB} \
    -p 5432:5432 \
    -d postgres

