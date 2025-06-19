#!/usr/bin/python3
 
import json
from time import time

import os

print(os.getcwd())

def timestring():
    return ''.join(str(time()).split('.'))

data_log_path = 'data-log.ignore/'
 
def log_data(data):
    the_path = data_log_path + timestring() + '.json'

    print(1)
    with open(the_path, 'w') as o:
        print(2)
        o.write(json.dumps(json.loads(data), indent=2))
        print(3)

def standardize(data):
    log_data(data)
    
    # For now
    return data
