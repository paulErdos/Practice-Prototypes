#!/usr/bin/env bash

# Halt Falcon server
# Detach to prevent bash echo silencing and silence non-error output
fuser -k 9001/tcp > /dev/null 2>&1 < /dev/null
