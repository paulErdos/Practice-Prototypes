#!/usr/bin/env bash


echo -n "9001 is "; [ -z "$(lsof -i :9001)" ] && echo "up" || echo "down"
