#!/usr/bin/bash

cd src/nf_server/
poetry run ./start-server.sh >> logs/log.txt 2>> logs/err.txt &
