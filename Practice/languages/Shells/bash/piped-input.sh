#!/usr/bin/env bash

# First, handle CLI args
for arg in "$@"; do
    echo "Arg: $arg"
done

# Then handle piped input, if any
if [ ! -t 0 ]; then
    while IFS= read -r line; do
        echo "Pipe: $line"
    done
fi

