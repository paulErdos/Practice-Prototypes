#!/usr/bin/bash

if [[ $# != 1 ]]; then
    echo 'usage: new-poetry-project name-of-your-project'
    exit 1
fi

poetry new $1
