#!/usr/bin/env bash

echo hello | tee basics-2-file-0.txt basics-2-file-1.txt basics-2-file-2.txt
echo world | tee -a basics-2-file-0.txt basics-2-file-1.txt basics-2-file-2.txt

