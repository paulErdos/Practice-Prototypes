#!/bin/bash

source ../.env

cat Dockerfile*Template | sed "s,{user},${POSTGRES_USER}," > Dockerfile.Postgres
cat Dockerfile.Postgres | sed "s,{pass},${POSTGRES_PASS}," >> Dockerfile.Postgres
cat Dockerfile.Postgres | sed "s,{db},${POSTGRES_DB}," >> Dockerfile.Postgres

docker build -t postgres-image-name:postgres-image-tag -f Dockerfile.Postgres .

