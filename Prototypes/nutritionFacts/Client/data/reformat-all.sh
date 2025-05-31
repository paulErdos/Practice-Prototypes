#!/usr/bin/bash

./reformat.js Elem* > RDA-Elements.json
./reformat.js Vita* > RDA-Vitamins.json
./reformat.js Macr* > RDA-Macros-and-Water.json
