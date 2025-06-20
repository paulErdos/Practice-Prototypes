#!/usr/bin/python3

from nf_server.services.drop_fields_from_json import drop_fields_from_json as drop_fields

import os
import json
from time import time

data_log_path = 'data-log.ignore/'


def timestring():
    return ''.join(str(time()).split('.'))

def log_data(data):
    the_path = data_log_path + timestring() + '.json'

    with open(the_path, 'w') as o:
        o.write(json.dumps(json.loads(data), indent=2))


def standardize(data):
    log_data(data)
    
    # For now
    return drop_fields(data)
