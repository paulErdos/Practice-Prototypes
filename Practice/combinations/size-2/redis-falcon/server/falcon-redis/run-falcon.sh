#!/bin/bash

uvicorn falcon_redis.falcon_app:app --reload --log-level debug
