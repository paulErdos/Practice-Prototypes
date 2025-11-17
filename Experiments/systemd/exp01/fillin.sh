#!/usr/bin/env bash

DIR=$(pwd)

sed "s,{{ thisdir }},$DIR," HelloWorld.service.template > HelloWorld.service
#sed -i "s,{{ thisdir }},$DIR," HelloWorld.service.template > HelloWorld.service.temp.dev.testing

# [ $# -ne 2 ] && echo "Usage: $0 arg1 'arg two'" && exit 1

