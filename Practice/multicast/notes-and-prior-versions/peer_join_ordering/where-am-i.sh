#!/usr/bin/env bash

h=$(hostname -I 2>&1 > /dev/null)
[ ! -z $? ] && my_ip=$(echo $h | awk '{ print $1 }')

# Otherwise try
my_ip=$(ifconfig | awk '/inet / && !/127.0.0.1/ {print $2}')

echo $my_ip
