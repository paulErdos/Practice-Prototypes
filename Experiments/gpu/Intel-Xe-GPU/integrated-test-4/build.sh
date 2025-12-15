#!/bin/bash
# Compile shader
glslangValidator -V mandelbrot.comp -o mandelbrot.spv

# Compile C++ code
g++ -std=c++17 -I/usr/include/vulkan -I/usr/include/libpng16 \
    main.cpp -o mandelbrot -lvulkan -lpng16

echo "Build complete. Run: ./mandelbrot <size> <iterations>"
