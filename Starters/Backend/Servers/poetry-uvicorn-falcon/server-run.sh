#!/usr/bin/bash

# Already running?
if [ $(./server-status.sh) -eq 1 ]; then
    echo 'Running.'
    exit
fi


# Start Server
cd asgi-starter/ && poetry run ./start-server.sh &
cd -
