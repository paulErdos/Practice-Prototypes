#!/usr/bin/env python3

import sys
import json
from pathlib import Path

def load_fields_to_drop() -> set:

    filename = Path("services/nutrient-fields-to-ignore")

    if not filename.exists():
        raise FileNotFoundError("nutrient-fields-to-ignore file not found")

    with open(filename, "r") as f:
        # Strip and ignore empty lines
        return {line.strip() for line in f if line.strip()}


def drop_fields_from_json(data, fields_to_drop: set):
    if isinstance(data, dict):
        return {
            key: drop_fields_from_json(value, fields_to_drop)
            for key, value in data.items()
            if key not in fields_to_drop
        }
    elif isinstance(data, list):
        return [drop_fields_from_json(item, fields_to_drop) for item in data]
    else:
        return data

def drop_fields(raw_json: str) -> str:
    fields_to_drop = load_fields_to_drop()
    data = json.loads(raw_json)
    cleaned_data = drop_fields_from_json(data, fields_to_drop)
    return json.dumps(cleaned_data, indent=2)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python drop_fields.py <input.json> <fields-to-drop.txt>")
        sys.exit(1)

    input_json_file = sys.argv[1]
    fields_file = sys.argv[2]

    with open(input_json_file, "r") as f:
        raw_json = f.read()

    cleaned_json = drop_fields_from_json(raw_json, fields_file)
    print(cleaned_json)

