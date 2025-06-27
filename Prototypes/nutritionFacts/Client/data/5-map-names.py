#!/usr/bin/python3

import copy
import json

files = (
    'UnitValues-UnitNames-Handled-Combined-RDA-TUI-Data.json',
    'name-remap-data.json'
)

data = []
for file in files:
    with open(file, 'r') as i:
        data.append(json.loads(i.read()))

envelope, names = data
renamed = copy.deepcopy(envelope)

for lifestage in envelope:
    for nutrient in envelope[lifestage]:
        if nutrient in names:
            value = copy.deepcopy(envelope[lifestage][nutrient])
            newKey = names[nutrient]
            renamed[lifestage][newKey] = value
            del renamed[lifestage][nutrient]

            
#print(json.dumps(renamed, indent=2, ensure_ascii=False))

#name = "NutrientNames-UnitValues-UnitNames-Handled-Combined-RDA-TUI-Data.json"
name = 'RDA-TUI-Data.json'
with open(name, 'w') as o:
    o.write(json.dumps(renamed, indent=2, ensure_ascii=False))
