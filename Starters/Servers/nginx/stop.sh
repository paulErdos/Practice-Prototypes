#!/usr/bin/env bash

# Politely request
./nginx-1.28.0/objs/nginx -p $(pwd) -c conf/nginx.conf -s stop


# Demand
lsof -i | egrep nginx | sed 's,^[^0-9]*\([^ ]*\)  *.*$,\1,' | xargs kill

