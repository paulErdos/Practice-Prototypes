#!/usr/bin/env bash

# TODO: make new keys with specific names
if [ "$SECURITY_HAZARD_ENABLED" != 'enthusiastic yes!' ]; then
    # If this isn't clear, whatever happens is deserved
    echo 'Error: Security flaws not enabled'
    exit 1
fi

cat ~/.ssh/polychoron-node-key.pub
