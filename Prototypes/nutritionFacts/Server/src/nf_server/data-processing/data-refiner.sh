#!/usr/bin/env bash

infile="$1"
outfile="${infile%.json}.cleaned.json"

grep -vFf nutrient-fields-to-ignore "$infile" \
  | ./fix-json-commas.py \
  | sed '$d' \
  | jq . - > "$outfile"

