#!/bin/bash

# Sudo runs in subshell
# Subshell does not inherit
source ../.env

docker run \
	--name postgres-container-name \
	-p 5432:5432 \
	-e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
	-e POSTGRES_USER=$POSTGRES_USER \
	-e POSTGRES_DB=$POSTGRES_DB \
	postgres-image-name:postgres-image-tag

# Or headless / detached
#docker run --name postgres-container-name -p 5432:5432 -d postgres-image-name

