#!/usr/bin/env bash

# e.g.:
#function run {
#    while [ "$(./reload* && cat ../Data/new-urls | wc -l)" -ne 0 ] ; do
#        echo running
#        get
#    done
#}


function hello {
    echo 'Hello'
}

# No parens, you just callit
hello


function muchadoaboutarguments {
    echo $1
    echo $2
    echo $#
}

muchadoaboutarguments 1 2 foobar

# Return values: must execute in subshell
returned_value=$(hello)
echo "Got: $returned_value"
