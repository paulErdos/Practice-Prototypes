#!/usr/bin/env python3

import re
import json
import sys

def remove_all_trailing_commas(text):
    # Remove commas before closing brackets/braces (across lines)
    text = re.sub(r',\s*(\n\s*[}\]])', r'\1', text)
    # Remove commas after } or ] if followed by another close
    text = re.sub(r'([}\]])\s*,\s*(\n\s*[}\]])', r'\1\2', text)
    # Remove trailing comma before final closing brace
    text = re.sub(r',\s*(\n\s*})', r'\1', text)
    return text


if __name__ == "__main__":
    raw = sys.stdin.read()
    fixed = remove_all_trailing_commas(raw)
    sys.stdout.write(fixed)


