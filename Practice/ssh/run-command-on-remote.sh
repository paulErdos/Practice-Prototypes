#!/usr/bin/bash

bar=$(ssh argon "echo foobar") && echo $bar
