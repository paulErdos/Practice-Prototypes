#!/usr/bin/env python3

'''
This script does the following:
* Adds unit name field
* Normalizes mass to milligram (some should be allowed to be ug but doing this for now)
'''

import copy
import json

filename = "UnitNames-Handled-Combined-RDA-TUI-Data.json"

with open(filename, 'r') as i:
    envelope = json.loads(i.read())


units_to_map = {'L': {'f': lambda u: u * 1000, 'newUnitName': 'g'}}


for lifestage in envelope:
    for nutrient in envelope[lifestage]:
        data = envelope[lifestage][nutrient]

        if data['unitName'] in units_to_map:
            print(data)
            data['rda'] = units_to_map[data['unitName']]['f'](data['rda'])
            data['unitName'] = units_to_map[data['unitName']]['newUnitName']
            print(data)


#print(json.dumps(renamed, indent=2, ensure_ascii=False))

name = 'UnitValues-UnitNames-Handled-Combined-RDA-TUI-Data.json'
with open(name, 'w') as o:
    o.write(json.dumps(envelope, indent=2, ensure_ascii=False))
