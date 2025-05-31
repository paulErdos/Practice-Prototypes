#!/usr/bin/python3

import json

files = {'RDA-Elements.json', 'RDA-Vitamins.json', 'RDA-Macros-and-Water.json'}

data = []
for file in files:
    with open(file, 'r') as i:
        data.append(json.loads(i.read())['Life Stage Group'])

aggd = {}

for datum in data:
    for lsg in datum:
        if lsg not in aggd:
            aggd[lsg] = datum[lsg]
            continue

        aggd[lsg] = {**aggd[lsg], **datum[lsg]}

with open('All-RDA.json', 'w') as o:
    o.write(json.dumps(aggd, indent=2, ensure_ascii=False))
