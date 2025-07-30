#!/usr/bin/env bash

[ "$#" -ne 1 ] && { echo "Usage: $0 <mongo_container_name>"; exit 1; }

if docker exec "$1" mongosh --port 27017 --eval 'JSON.stringify(db.runCommand({hello: 1}))' 2>/dev/null | grep -q '"ok":1'; then
    echo "MongoDB in '$1' is running."
else
    echo "MongoDB in '$1' is NOT running or unresponsive." && exit 1
fi

