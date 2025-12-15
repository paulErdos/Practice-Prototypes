#!/usr/bin/env bash

count=1
while [ $count -lt 100 ]; do
	./mandelbrot 10000 $count
	((count++))
done
