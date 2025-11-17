#!/usr/bin/env bash

DIR=$(pwd)

sed "s,{{ thisdir }},$DIR," HelloWorld.service.template > HelloWorld.service

