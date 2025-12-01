#!/usr/bin/env bash

systemctl --user daemon-reload
systemctl --user enable HelloWorld.service
systemctl --user start HelloWorld.service

