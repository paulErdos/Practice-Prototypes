#!/usr/bin/bash

## TODO: Move notes to bash notes

# Notes: space separated nonwhitespace in parens is an array
a=($(ps | egrep 'start-server.sh|uvicorn|python' | sed 's,^\([^ ]*\) .*$,\1,'))

# The first element of the array
#echo $a

# The array itself
#echo ${a[@]}

# The number of elements in the array
if [ ${#a[@]} -eq 0 ]; then
    echo 0
else
    echo 1
fi

