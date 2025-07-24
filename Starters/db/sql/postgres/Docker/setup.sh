#!/usr/bin/env bash

# 0: prep
read -p "First, set credentials. Ready? Press return. "
vim template.env
mv template.env .env
source .env
echo 'Got env vars'
echo

cd postgres-docker

cat Dockerfile*Template > Dockerfile.Postgres
sed -i "s,{user},${POSTGRES_USER}," Dockerfile.Postgres
sed -i "s,{pass},${POSTGRES_USER}," Dockerfile.Postgres
sed -i "s,{db},${POSTGRES_USER}," Dockerfile.Postgres

