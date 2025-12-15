#!/bin/bash
set -e

g++ -std=c++17 -O2 mandelbrot.cpp -lOpenCL -o mandelbrot_cpp_embedded

