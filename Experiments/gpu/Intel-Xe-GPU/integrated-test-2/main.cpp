#include <vulkan/vulkan.h>
#include <png.h>
#include <iostream>
#include <vector>
#include <fstream>
#include <cstring>
#include <cstdint>
#include <chrono>
#include <complex>

#define CHECK_VK(result, msg) \
    if (result != VK_SUCCESS) { \
        std::cerr << "Vulkan error: " << msg << " (Code: " << result << ")\n"; \
        return 1; \
    }

std::vector<char> readFile(const std::string& filename) {
    std::ifstream file(filename, std::ios::ate | std::ios::binary);
    if (!file.is_open()) throw std::runtime_error("Failed to open file: " + filename);
    
    size_t fileSize = (size_t)file.tellg();
    std::vector<char> buffer(fileSize);
    file.seekg(0);
    file.read(buffer.data(), fileSize);
    file.close();
    return buffer;
}

int write_png(const char* filename, uint32_t width, uint32_t height, const uint8_t* data) {
    FILE* fp = fopen(filename, "wb");
    if (!fp) return 1;
    
    png_structp png = png_create_write_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);
    png_infop info = png_create_info_struct(png);
    png_init_io(png, fp);
    
    png_set_IHDR(png, info, width, height, 8, PNG_COLOR_TYPE_GRAY,
                 PNG_INTERLACE_NONE, PNG_COMPRESSION_TYPE_DEFAULT,
                 PNG_FILTER_TYPE_DEFAULT);
    png_write_info(png, info);
    
    for (uint32_t y = 0; y < height; ++y) {
        png_write_row(png, data + y * width);
    }
    
    png_write_end(png, NULL);
    fclose(fp);
    png_destroy_write_struct(&png, &info);
    return 0;
}

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <grid_size> <max_iterations>\n";
        std::cerr << "Example: " << argv[0] << " 512 100\n";
        return 1;
    }
    
    uint32_t N = std::stoi(argv[1]);
    uint32_t MAX_ITERATIONS = std::stoi(argv[2]);
    float SCALE = 1.0f;
    const size_t DATA_SIZE = N * N * sizeof(uint32_t);
    
    auto startTime = std::chrono::high_resolution_clock::now();
    
    try {
        // 1. Initialize Vulkan
        VkApplicationInfo appInfo{};
        appInfo.sType = VK_STRUCTURE_TYPE_APPLICATION_INFO;
        appInfo.pApplicationName = "Mandelbrot";
        appInfo.apiVersion = VK_API_VERSION_1_2;
        
        VkInstanceCreateInfo instanceInfo{};
        instanceInfo.sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
        instanceInfo.pApplicationInfo = &appInfo;
        
        VkInstance instance;
        CHECK_VK(vkCreateInstance(&instanceInfo, nullptr, &instance), "Failed to create instance");
        
        // 2. Get physical device
        uint32_t deviceCount = 0;
        vkEnumeratePhysicalDevices(instance, &deviceCount, nullptr);
        std::vector<VkPhysicalDevice> devices(deviceCount);
        vkEnumeratePhysicalDevices(instance, &deviceCount, devices.data());
        VkPhysicalDevice physicalDevice = devices[0];
        
        // 3. Find compute queue family
        uint32_t queueFamilyCount = 0;
        vkGetPhysicalDeviceQueueFamilyProperties(physicalDevice, &queueFamilyCount, nullptr);
        std::vector<VkQueueFamilyProperties> queueFamilies(queueFamilyCount);
        vkGetPhysicalDeviceQueueFamilyProperties(physicalDevice, &queueFamilyCount, queueFamilies.data());
        
        uint32_t computeQueueFamily = 0;
        for (uint32_t i = 0; i < queueFamilyCount; i++) {
            if (queueFamilies[i].queueFlags & VK_QUEUE_COMPUTE_BIT) {
                computeQueueFamily = i;
                break;
            }
        }
        
        // 4. Create logical device
        float queuePriority = 1.0f;
        VkDeviceQueueCreateInfo queueInfo{};
        queueInfo.sType = VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO;
        queueInfo.queueFamilyIndex = computeQueueFamily;
        queueInfo.queueCount = 1;
        queueInfo.pQueuePriorities = &queuePriority;
        
        VkDeviceCreateInfo deviceInfo{};
        deviceInfo.sType = VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO;
        deviceInfo.queueCreateInfoCount = 1;
        deviceInfo.pQueueCreateInfos = &queueInfo;
        
        VkDevice device;
        CHECK_VK(vkCreateDevice(physicalDevice, &deviceInfo, nullptr, &device), "Failed to create device");
        
        // 5. Get compute queue
        VkQueue computeQueue;
        vkGetDeviceQueue(device, computeQueueFamily, 0, &computeQueue);
        
        // 6. Create shader module from SPIR-V
        auto shaderCode = readFile("mandelbrot.comp.spv");
        VkShaderModuleCreateInfo shaderInfo{};
        shaderInfo.sType = VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO;
        shaderInfo.codeSize = shaderCode.size();
        shaderInfo.pCode = reinterpret_cast<const uint32_t*>(shaderCode.data());
        
        VkShaderModule shaderModule;
        CHECK_VK(vkCreateShaderModule(device, &shaderInfo, nullptr, &shaderModule), "Failed to create shader module");
        
        // 7. Create pipeline
        VkPipelineLayoutCreateInfo pipelineLayoutInfo{};
        pipelineLayoutInfo.sType = VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO;
        
        VkPipelineLayout pipelineLayout;
        CHECK_VK(vkCreatePipelineLayout(device, &pipelineLayoutInfo, nullptr, &pipelineLayout), "Failed to create pipeline layout");
        
        VkComputePipelineCreateInfo pipelineInfo{};
        pipelineInfo.sType = VK_STRUCTURE_TYPE_COMPUTE_PIPELINE_CREATE_INFO;
        pipelineInfo.stage.sType = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
        pipelineInfo.stage.stage = VK_SHADER_STAGE_COMPUTE_BIT;
        pipelineInfo.stage.module = shaderModule;
        pipelineInfo.stage.pName = "main";
        pipelineInfo.layout = pipelineLayout;
        
        VkPipeline pipeline;
        CHECK_VK(vkCreateComputePipelines(device, VK_NULL_HANDLE, 1, &pipelineInfo, nullptr, &pipeline), "Failed to create pipeline");
        
        // 8. Create buffer
        VkBufferCreateInfo bufferInfo{};
        bufferInfo.sType = VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO;
        bufferInfo.size = DATA_SIZE;
        bufferInfo.usage = VK_BUFFER_USAGE_STORAGE_BUFFER_BIT;
        bufferInfo.sharingMode = VK_SHARING_MODE_EXCLUSIVE;
        
        VkBuffer buffer;
        CHECK_VK(vkCreateBuffer(device, &bufferInfo, nullptr, &buffer), "Failed to create buffer");
        
        // 9. Allocate memory
        VkMemoryRequirements memRequirements;
        vkGetBufferMemoryRequirements(device, buffer, &memRequirements);
        
        VkPhysicalDeviceMemoryProperties memProperties;
        vkGetPhysicalDeviceMemoryProperties(physicalDevice, &memProperties);
        
        uint32_t memoryTypeIndex = 0;
        for (uint32_t i = 0; i < memProperties.memoryTypeCount; i++) {
            if (memRequirements.memoryTypeBits & (1 << i) &&
                (memProperties.memoryTypes[i].propertyFlags & 
                 (VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT))) {
                memoryTypeIndex = i;
                break;
            }
        }
        
        VkMemoryAllocateInfo allocInfo{};
        allocInfo.sType = VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_INFO;
        allocInfo.allocationSize = memRequirements.size;
        allocInfo.memoryTypeIndex = memoryTypeIndex;
        
        VkDeviceMemory bufferMemory;
        CHECK_VK(vkAllocateMemory(device, &allocInfo, nullptr, &bufferMemory), "Failed to allocate memory");
        vkBindBufferMemory(device, buffer, bufferMemory, 0);
        
        // 10. Create descriptor set (simplified - real app needs descriptor pool)
        // Skipping for brevity - using push constants instead
        
        // 11. Map memory and run compute
        uint32_t* data;
        CHECK_VK(vkMapMemory(device, bufferMemory, 0, DATA_SIZE, 0, (void**)&data), "Failed to map memory");
        
        // Set push constants
        struct PushConstants {
            uint32_t n;
            uint32_t maxIterations;
            float scale;
        } pushConstants = {N, MAX_ITERATIONS, SCALE};
        
        // Record command buffer
        VkCommandPoolCreateInfo cmdPoolInfo{};
        cmdPoolInfo.sType = VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO;
        cmdPoolInfo.queueFamilyIndex = computeQueueFamily;
        
        VkCommandPool commandPool;
        CHECK_VK(vkCreateCommandPool(device, &cmdPoolInfo, nullptr, &commandPool), "Failed to create command pool");
        
        VkCommandBufferAllocateInfo cmdAllocInfo{};
        cmdAllocInfo.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO;
        cmdAllocInfo.commandPool = commandPool;
        cmdAllocInfo.level = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
        cmdAllocInfo.commandBufferCount = 1;
        
        VkCommandBuffer commandBuffer;
        CHECK_VK(vkAllocateCommandBuffers(device, &cmdAllocInfo, &commandBuffer), "Failed to allocate command buffer");
        
        VkCommandBufferBeginInfo beginInfo{};
        beginInfo.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO;
        beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;
        
        vkBeginCommandBuffer(commandBuffer, &beginInfo);
        vkCmdBindPipeline(commandBuffer, VK_PIPELINE_BIND_POINT_COMPUTE, pipeline);
        vkCmdPushConstants(commandBuffer, pipelineLayout, VK_SHADER_STAGE_COMPUTE_BIT, 0, sizeof(PushConstants), &pushConstants);
        vkCmdDispatch(commandBuffer, (N + 15) / 16, (N + 15) / 16, 1);
        vkEndCommandBuffer(commandBuffer);
        
        // Submit
        VkSubmitInfo submitInfo{};
        submitInfo.sType = VK_STRUCTURE_TYPE_SUBMIT_INFO;
        submitInfo.commandBufferCount = 1;
        submitInfo.pCommandBuffers = &commandBuffer;
        
        vkQueueSubmit(computeQueue, 1, &submitInfo, VK_NULL_HANDLE);
        vkQueueWaitIdle(computeQueue);
        
        // 12. Normalize to grayscale
        std::vector<uint8_t> imageData(N * N);
        for (size_t i = 0; i < N * N; i++) {
            imageData[i] = (uint8_t)((data[i] * 255) / MAX_ITERATIONS);
        }
        
        vkUnmapMemory(device, bufferMemory);
        
        // 13. Timing and output
        auto endTime = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime).count();
        
        std::string filename = std::to_string(duration) + "ms.png";
        if (write_png(filename.c_str(), N, N, imageData.data()) == 0) {
            std::cout << "Generated " << filename << " in " << duration << " ms\n";
        } else {
            std::cerr << "Failed to write PNG.\n";
        }
        
        // 14. Cleanup
        vkDestroyCommandPool(device, commandPool, nullptr);
        vkDestroyBuffer(device, buffer, nullptr);
        vkFreeMemory(device, bufferMemory, nullptr);
        vkDestroyPipeline(device, pipeline, nullptr);
        vkDestroyPipelineLayout(device, pipelineLayout, nullptr);
        vkDestroyShaderModule(device, shaderModule, nullptr);
        vkDestroyDevice(device, nullptr);
        vkDestroyInstance(instance, nullptr);
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << "\n";
        return 1;
    }
    
    return 0;
}