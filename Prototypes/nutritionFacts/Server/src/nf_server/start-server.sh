#!/usr/bin/bash

uvicorn app:app --host 0.0.0.0 --port 9001 --reload --log-level debug
