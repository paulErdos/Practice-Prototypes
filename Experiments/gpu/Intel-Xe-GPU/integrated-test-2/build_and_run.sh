#!/bin/bash
# Build and run the Mandelbrot compute shader
mkdir -p build
cd build

# Configure and build
cmake ..
make

# Ensure shader is compiled
if [ ! -f mandelbrot.comp.spv ]; then
    echo "Compiling shader..."
    glslangValidator -V ../mandelbrot.comp -o mandelbrot.comp.spv
fi

# Run with default parameters (512x512, 100 iterations)
./mandelbrot 512 100