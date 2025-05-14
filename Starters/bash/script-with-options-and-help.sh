#!/usr/bin/bash

# Readme
# Set ip and port for deployments each on their own line in file 'deployments' in this directory.

# Returns 
# -1: no deployments
# 0: all expected are running
# 1: some expected are running (also prints deployments that are not running)
# 2: zero expected are running (also prints deployments that are not running)


##############################################
#### Foreword: Utils Warehouse
##############################################

help() {
    echo 'Usage: deployments-status [option]'
    echo
    echo 'The number of running deployments. With -i or --info,'
    echo "describes what's seen, and what we expect to be see."
    echo
    echo 'Options:'
    echo '  -i, --info:    Print observed / expected.'
    echo '  -h, --help     Prints this message.' 
    echo
}

# Echo to stderr
err() {
    echo "$1" >&2
}


##############################################
#### Prelude 1/2: Options
##############################################

i=false
info=false
h=false
help=false

# Long
while [[ "$1" == --* ]]; do
    case "$1" in
        --info) info=true; shift ;;
        --help) help=true; shift ;;
        *) help; shift ;;
    esac
done

# Short
while getopts 'ih' opt; do
    case "$opt" in
        i) i=true;;
        h) h=true;;
        \?) help ;;
    esac
done


##############################################
#### Prelude 2/2: Help
##############################################

if [[ $h || $help ]]; then
    help
    exit
fi