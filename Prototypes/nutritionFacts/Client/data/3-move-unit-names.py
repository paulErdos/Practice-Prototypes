#!/usr/bin/env python3

'''
This script does the following:
* Adds unit name field
* Normalizes mass to milligram (some should be allowed to be ug but doing this for now)
'''

import copy
import json

filename = 'Combined-RDA-TUI.json'

with open(filename, 'r') as i:
    envelope = json.loads(i.read())

renamed = copy.deepcopy(envelope)


def extract_unit(n):
    return n.split(' ')[-1].strip('()').split('/')[0]

for lifestage in envelope:
    for nutrient in envelope[lifestage]:
        if '/' in nutrient:
            value = {**envelope[lifestage][nutrient]}
            value['unitName'] = extract_unit(nutrient)

            new_key = nutrient.split(' (')[0]
            renamed[lifestage][new_key] = value

            del renamed[lifestage][nutrient]
            
#print(json.dumps(renamed, indent=2, ensure_ascii=False))

with open('UnitNames-Handled-Combined-RDA-TUI-Data.json', 'w') as o:
    o.write(json.dumps(renamed, indent=2, ensure_ascii=False))
