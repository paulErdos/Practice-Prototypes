#!/usr/bin/env python3

import sys
import re
import json
from pathlib import Path


def remove_all_trailing_commas(text: str) -> str:
    text = re.sub(r',\s*(\n\s*[}\]])', r'\1', text)
    text = re.sub(r'([}\]])\s*,\s*(\n\s*[}\]])', r'\1\2', text)
    text = re.sub(r',\s*(\n\s*})', r'\1', text)
    return text

def clean_json(raw: str) -> str:
    ignore_file = Path("services/nutrient-fields-to-ignore")
    if not ignore_file.exists():
        raise FileNotFoundError("nutrient-fields-to-ignore file not found")

    with ignore_file.open() as f:
        ignore_lines = [line.strip() for line in f if line.strip()]

    lines = raw.splitlines()
    filtered = [line for line in lines if all(ig not in line for ig in ignore_lines)]

    if filtered:
        filtered = filtered[:-1]  # drop last line

    cleaned_text = remove_all_trailing_commas('\n'.join(filtered))

    data = json.loads(cleaned_text)
    return json.dumps(data, indent=2)

def main():
    if len(sys.argv) != 2:
        print("Usage: clean_json.py <input.json>", file=sys.stderr)
        sys.exit(1)

    infile = Path(sys.argv[1])
    outfile = infile.with_name(infile.stem + ".cleaned.json")

    with infile.open() as f:
        raw = f.read()

    try:
        result = clean_json(raw)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    with outfile.open("w") as f:
        f.write(result)

if __name__ == "__main__":
    main()

