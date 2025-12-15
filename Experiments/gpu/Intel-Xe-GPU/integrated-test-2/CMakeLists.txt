cmake_minimum_required(VERSION 3.10)
project(VulkanMandelbrot)

set(CMAKE_CXX_STANDARD 17)

find_package(PNG REQUIRED)
find_package(Vulkan REQUIRED)

# Convert GLSL shader to SPIR-V
find_program(GLSLANGVALIDATOR glslangValidator REQUIRED)
add_custom_command(
    OUTPUT mandelbrot.comp.spv
    COMMAND ${GLSLANGVALIDATOR} -V mandelbrot.comp -o mandelbrot.comp.spv
    DEPENDS mandelbrot.comp
)

add_executable(mandelbrot main.cpp mandelbrot.comp.spv)
target_link_libraries(mandelbrot Vulkan::Vulkan PNG::PNG)