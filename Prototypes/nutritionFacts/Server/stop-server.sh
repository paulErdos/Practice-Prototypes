#!/usr/bin/env bash

lsof -i :9001 | egrep -v COMM | sed 's,^[^0-9]*\([^ ]*\)  *.*$,\1,' | xargs kill
