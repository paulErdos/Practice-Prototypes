#!/usr/bin/bash

# Gather what we're responsible for
a=($(ps | egrep 'start-server.sh|uvicorn|python' | sed 's,^\([^ ]*\) .*$,\1,'))


# Don't worry if there's none
if [ ${#a[@]} -eq 0 ]; then
    echo 'Nothing to stop.'
    exit
fi


# Close
## TODO: This does not fully silence 
echo ${a[@]} | xargs kill 2>&1 > /dev/null
sleep 1  # Cleanliness; wait for uvicorn to barf up its garbage
echo 'Done'  # Much nicer than handing the user control of a totally blank line
