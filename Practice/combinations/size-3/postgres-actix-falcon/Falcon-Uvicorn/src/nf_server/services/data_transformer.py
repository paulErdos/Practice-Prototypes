#!/usr/bin/python3

from nf_server.services.data_cleaning import clean

import os
import json
from time import time

data_log_path = 'data-log.ignore/'


def timestring():
    return ''.join(str(time()).split('.'))


def log_data(data):
    the_path = data_log_path + timestring() + '.json'

    with open(the_path, 'w') as o:
        o.write(json.dumps(data, indent=2))


def standardize(data):
    log_data(data)    
    return clean(data)
