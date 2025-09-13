#!/bin/bash

# Get our join order from the multicast discovery
# Run roster.py in background and kill it after a few seconds
timeout 5 python3 -u roster.py > roster_output.txt 2>&1

# Parse the output to get our join order
JOIN_ORDER=$(grep "Timestamps:" roster_output.txt | tail -1 | sed "s/.*'\([0-9]*\): me.*/\1/" 2>/dev/null)

# Clean up
#rm -f roster_output.txt

# If we can't get join order, default to 0
if [ -z "$JOIN_ORDER" ]; then
    JOIN_ORDER=0
fi

echo "Our join order: $JOIN_ORDER"

# Copy template to docker-compose.yml
cp docker-compose-template.yml docker-compose.yml

# Use sed to comment out lines ending with our join order number
sed -i "s/^\(.*\)#$JOIN_ORDER$/#\1#$JOIN_ORDER/" docker-compose.yml

echo "Generated docker-compose.yml with service #$JOIN_ORDER commented out"
