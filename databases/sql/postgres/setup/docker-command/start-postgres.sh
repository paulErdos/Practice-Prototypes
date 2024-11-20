#!/bin/bash

docker run \
    --name postgres-container \
    -e POSTGRES_USER=yourusername \
    -e POSTGRES_PASSWORD=yourpassword \
    -e POSTGRES_DB=yourdbname \
    -p 5432:5432 \
    -d postgres

