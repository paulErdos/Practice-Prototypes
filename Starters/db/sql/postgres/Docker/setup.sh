#!/usr/bin/env bash

echo 'Setup initiated'

# 0: prep
read -p "First, set credentials. Ready? Press return. "
vim template.env
mv template.env .env
source .env
echo 'Got env vars'
echo

cd postgres-docker

echo -n 'Fillin Dockerfile template... '
cat Dockerfile*Template > Dockerfile.Postgres
sed -i "s,{user},${POSTGRES_USER}," Dockerfile.Postgres
sed -i "s,{pass},${POSTGRES_USER}," Dockerfile.Postgres
sed -i "s,{db},${POSTGRES_USER}," Dockerfile.Postgres
echo 'Done'

echo 'Setup complete'
