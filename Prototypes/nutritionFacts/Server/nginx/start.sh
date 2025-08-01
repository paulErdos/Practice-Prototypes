#!/usr/bin/env bash

./nginx-1.28.0/objs/nginx \
    -p $(pwd) \
    -e logs/error.log \
    -c conf/nginx.conf

#Options:
#  -?,-h         : this help
#  -v            : show version and exit
#  -V            : show version and configure options then exit
#  -t            : test configuration and exit
#  -T            : test configuration, dump it and exit
#  -q            : suppress non-error messages during configuration testing
#  -s signal     : send signal to a master process: stop, quit, reopen, reload
#  -p prefix     : set prefix path (default: /usr/local/nginx/)
#  -e filename   : set error log file (default: logs/error.log)
#  -c filename   : set configuration file (default: conf/nginx.conf)
#  -g directives : set global directives out of configuration file

