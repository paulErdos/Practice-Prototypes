#define CL_TARGET_OPENCL_VERSION 220
#include <CL/cl.hpp>
#include <iostream>
#include <vector>
#include <chrono>
#include <fstream>
#include <sstream>
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image_write.h"

// Function to read kernel source from file
std::string load_kernel(const std::string &filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        throw std::runtime_error("Cannot open kernel file: " + filename);
    }
    std::stringstream ss;
    ss << file.rdbuf();
    return ss.str();
}

int main() {
    const int n = 1024;
    const int max_iter = 100;
    const float xmin = -1.0f, xmax = 1.0f;
    const float ymin = -1.0f, ymax = 1.0f;

    // Load kernel from file
    std::string kernel_source = load_kernel("mandelbrot.cl");

    // Select Intel GPU device (integrated graphics)
    std::vector<cl::Platform> platforms;
    cl::Platform::get(&platforms);
    cl::Platform platform;
    cl::Device device;
    bool found = false;

    for (auto &p : platforms) {
        std::vector<cl::Device> devices;
        p.getDevices(CL_DEVICE_TYPE_GPU, &devices);
        for (auto &d : devices) {
            std::string name = d.getInfo<CL_DEVICE_NAME>();
            if (name.find("Intel") != std::string::npos) {
                platform = p;
                device = d;
                found = true;
                break;
            }
        }
        if (found) break;
    }

    if (!found) {
        std::cerr << "No Intel integrated GPU found!" << std::endl;
        return 1;
    }

    cl::Context context(device);
    cl::Program program(context, kernel_source);
    if (program.build({device}) != CL_SUCCESS) {
        std::cerr << "Error building: " << program.getBuildInfo<CL_PROGRAM_BUILD_LOG>(device) << "\n";
        return 1;
    }

    cl::CommandQueue queue(context, device);

    // Allocate buffer
    std::vector<unsigned char> output(n * n);
    cl::Buffer buffer(context, CL_MEM_WRITE_ONLY, output.size());

    // Set kernel args
    cl::Kernel kernel(program, "mandelbrot");
    kernel.setArg(0, buffer);
    kernel.setArg(1, n);
    kernel.setArg(2, max_iter);
    kernel.setArg(3, xmin);
    kernel.setArg(4, xmax);
    kernel.setArg(5, ymin);
    kernel.setArg(6, ymax);

    // Execute kernel
    auto start = std::chrono::high_resolution_clock::now();
    queue.enqueueNDRangeKernel(kernel, cl::NullRange, cl::NDRange(n, n));
    queue.finish();
    auto end = std::chrono::high_resolution_clock::now();

    // Read results
    queue.enqueueReadBuffer(buffer, CL_TRUE, 0, output.size(), output.data());

    // Save PNG
    float duration = std::chrono::duration<float>(end - start).count();
    std::string filename = std::to_string(duration) + ".png";
    stbi_write_png(filename.c_str(), n, n, 1, output.data(), n);

    std::cout << "Saved Mandelbrot image as " << filename << std::endl;
    return 0;
}

