#!/usr/bin/env python3

import sys
import re
import json
from pathlib import Path

def remove_all_trailing_commas(text):
    # Remove commas before closing brackets/braces (across lines)
    text = re.sub(r',\s*(\n\s*[}\]])', r'\1', text)
    # Remove commas after } or ] if followed by another close
    text = re.sub(r'([}\]])\s*,\s*(\n\s*[}\]])', r'\1\2', text)
    # Remove trailing comma before final closing brace
    text = re.sub(r',\s*(\n\s*})', r'\1', text)
    return text

def main():
    if len(sys.argv) != 2:
        print("Usage: clean_json.py <input.json>", file=sys.stderr)
        sys.exit(1)

    infile = Path(sys.argv[1])
    outfile = infile.with_name(infile.stem + ".cleaned.json")
    ignore_file = Path("nutrient-fields-to-ignore")

    if not ignore_file.exists():
        print("Missing nutrient-fields-to-ignore file", file=sys.stderr)
        sys.exit(1)

    with ignore_file.open() as f:
        ignore_lines = set(line.strip() for line in f if line.strip())

    with infile.open() as f:
        lines = f.readlines()

    # Filter out ignored lines
    filtered_lines = [line for line in lines if all(ig not in line for ig in ignore_lines)]

    # Remove last line
    if filtered_lines:
        filtered_lines = filtered_lines[:-1]

    raw = ''.join(filtered_lines)
    cleaned = remove_all_trailing_commas(raw)

    try:
        # Pretty-print JSON to file
        parsed = json.loads(cleaned)
        with outfile.open("w") as out:
            json.dump(parsed, out, indent=2)
    except json.JSONDecodeError as e:
        print("JSON parse error after cleaning:", e, file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

