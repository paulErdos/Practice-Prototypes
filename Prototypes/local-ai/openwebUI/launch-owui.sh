#!/usr/bin/env bash

echo 'serving on http://localhost:8080/'

DATA_DIR=~/.open-webui \
#WEBUI_AUTH=False
OLLAMA_BASE_URL=http://192.168.1.6:1234/v1/
uvx --python 3.11 open-webui@latest serve
