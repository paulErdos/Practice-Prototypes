#!/usr/bin/python3

import json

files = {'All-RDA.json', 'All-TUI-Placeholder.json'}

data = []
for file in files:
    with open(file, 'r') as i:
        data.append(json.loads(i.read()))

# Aggregate into rda
rda, tui = data

for lsg in tui:
    for datum in tui[lsg]:
        rda[lsg][datum] = {'rda': rda[lsg][datum], 'tui': tui[lsg][datum]}

with open('Combined-RDA-TUI.json', 'w') as o:
    o.write(json.dumps(rda, indent=2, ensure_ascii=False))
