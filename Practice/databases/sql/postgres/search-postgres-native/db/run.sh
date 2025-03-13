#!/bin/bash

docker run --name postgres-container-name -p 5432:543 postgres-tag

# Or headless / detached
#docker run --name postgres-container-name -p 5432:5432 -d postgres-tag

