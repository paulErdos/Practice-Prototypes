#include <vulkan/vulkan.h>
#include <iostream>
#include <vector>
#include <cstring>
#include <chrono>
#include <fstream>
#include <png.h>

#define CHECK_VK(result, msg) \
    if (result != VK_SUCCESS) { \
        std::cerr << "[" << __LINE__ << "] " << msg << ": " << result << "\n"; \
        return 1; \
    }

std::vector<char> readFile(const std::string& filename) {
    std::ifstream file(filename, std::ios::ate | std::ios::binary);
    if (!file.is_open()) throw std::runtime_error("Failed to open " + filename);
    size_t fileSize = file.tellg();
    std::vector<char> buffer(fileSize);
    file.seekg(0);
    file.read(buffer.data(), fileSize);
    file.close();
    return buffer;
}

VkShaderModule createShaderModule(VkDevice device, const std::vector<char>& code) {
    VkShaderModuleCreateInfo createInfo{};
    createInfo.sType = VK_STRUCTURE_TYPE_SHADER_MODULE_CREATE_INFO;
    createInfo.codeSize = code.size();
    createInfo.pCode = reinterpret_cast<const uint32_t*>(code.data());
    
    VkShaderModule shaderModule;
    if (vkCreateShaderModule(device, &createInfo, nullptr, &shaderModule) != VK_SUCCESS) {
        throw std::runtime_error("Failed to create shader module");
    }
    return shaderModule;
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
        std::cerr << "Usage: " << argv[0] << " <size> <iterations>\n";
        return 1;
    }
    
    uint32_t N = std::stoi(argv[1]);
    uint32_t maxIter = std::stoi(argv[2]);
    const size_t dataSize = N * N * sizeof(uint32_t);
    
    auto startTime = std::chrono::high_resolution_clock::now();
    
    try {
        // 1. Instance
        VkInstance instance;
        VkInstanceCreateInfo instanceInfo{};
        instanceInfo.sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
        CHECK_VK(vkCreateInstance(&instanceInfo, nullptr, &instance), "Instance");
        
        // 2. Physical device
        uint32_t deviceCount = 0;
        vkEnumeratePhysicalDevices(instance, &deviceCount, nullptr);
        std::vector<VkPhysicalDevice> devices(deviceCount);
        vkEnumeratePhysicalDevices(instance, &deviceCount, devices.data());
        VkPhysicalDevice physicalDevice = devices[0];
        
        // 3. Compute queue
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
        
        // 4. Device
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
        CHECK_VK(vkCreateDevice(physicalDevice, &deviceInfo, nullptr, &device), "Device");
        
        // 5. Queue
        VkQueue computeQueue;
        vkGetDeviceQueue(device, computeQueueFamily, 0, &computeQueue);
        
        // 6. Load shader
        auto shaderCode = readFile("mandelbrot.spv");
        VkShaderModule shaderModule = createShaderModule(device, shaderCode);
        
        // 7. Descriptor set layout
        VkDescriptorSetLayoutBinding layoutBinding{};
        layoutBinding.binding = 0;
        layoutBinding.descriptorType = VK_DESCRIPTOR_TYPE_STORAGE_BUFFER;
        layoutBinding.descriptorCount = 1;
        layoutBinding.stageFlags = VK_SHADER_STAGE_COMPUTE_BIT;
        
        VkDescriptorSetLayoutCreateInfo layoutInfo{};
        layoutInfo.sType = VK_STRUCTURE_TYPE_DESCRIPTOR_SET_LAYOUT_CREATE_INFO;
        layoutInfo.bindingCount = 1;
        layoutInfo.pBindings = &layoutBinding;
        
        VkDescriptorSetLayout descriptorSetLayout;
        CHECK_VK(vkCreateDescriptorSetLayout(device, &layoutInfo, nullptr, &descriptorSetLayout), "Descriptor layout");
        
        // 8. Pipeline layout with push constants
        VkPushConstantRange pushConstantRange{};
        pushConstantRange.stageFlags = VK_SHADER_STAGE_COMPUTE_BIT;
        pushConstantRange.offset = 0;
        pushConstantRange.size = 12; // n + maxIter + scale
        
        VkPipelineLayoutCreateInfo pipelineLayoutInfo{};
        pipelineLayoutInfo.sType = VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO;
        pipelineLayoutInfo.setLayoutCount = 1;
        pipelineLayoutInfo.pSetLayouts = &descriptorSetLayout;
        pipelineLayoutInfo.pushConstantRangeCount = 1;
        pipelineLayoutInfo.pPushConstantRanges = &pushConstantRange;
        
        VkPipelineLayout pipelineLayout;
        CHECK_VK(vkCreatePipelineLayout(device, &pipelineLayoutInfo, nullptr, &pipelineLayout), "Pipeline layout");
        
        // 9. Compute pipeline
        VkPipelineShaderStageCreateInfo shaderStageInfo{};
        shaderStageInfo.sType = VK_STRUCTURE_TYPE_PIPELINE_SHADER_STAGE_CREATE_INFO;
        shaderStageInfo.stage = VK_SHADER_STAGE_COMPUTE_BIT;
        shaderStageInfo.module = shaderModule;
        shaderStageInfo.pName = "main";
        
        VkComputePipelineCreateInfo pipelineInfo{};
        pipelineInfo.sType = VK_STRUCTURE_TYPE_COMPUTE_PIPELINE_CREATE_INFO;
        pipelineInfo.stage = shaderStageInfo;
        pipelineInfo.layout = pipelineLayout;
        
        VkPipeline pipeline;
        CHECK_VK(vkCreateComputePipelines(device, VK_NULL_HANDLE, 1, &pipelineInfo, nullptr, &pipeline), "Pipeline");
        
        // 10. Buffer
        VkBufferCreateInfo bufferInfo{};
        bufferInfo.sType = VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO;
        bufferInfo.size = dataSize;
        bufferInfo.usage = VK_BUFFER_USAGE_STORAGE_BUFFER_BIT | VK_BUFFER_USAGE_TRANSFER_SRC_BIT;
        bufferInfo.sharingMode = VK_SHARING_MODE_EXCLUSIVE;
        
        VkBuffer buffer;
        CHECK_VK(vkCreateBuffer(device, &bufferInfo, nullptr, &buffer), "Buffer");
        
        // 11. Memory
        VkMemoryRequirements memRequirements;
        vkGetBufferMemoryRequirements(device, buffer, &memRequirements);
        
        VkPhysicalDeviceMemoryProperties memProps;
        vkGetPhysicalDeviceMemoryProperties(physicalDevice, &memProps);
        
        uint32_t memoryTypeIndex = 0;
        for (uint32_t i = 0; i < memProps.memoryTypeCount; i++) {
            if ((memRequirements.memoryTypeBits & (1 << i)) &&
                (memProps.memoryTypes[i].propertyFlags & 
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
        CHECK_VK(vkAllocateMemory(device, &allocInfo, nullptr, &bufferMemory), "Memory");
        vkBindBufferMemory(device, buffer, bufferMemory, 0);
        
        // 12. Descriptor pool and set
        VkDescriptorPoolSize poolSize{};
        poolSize.type = VK_DESCRIPTOR_TYPE_STORAGE_BUFFER;
        poolSize.descriptorCount = 1;
        
        VkDescriptorPoolCreateInfo poolInfo{};
        poolInfo.sType = VK_STRUCTURE_TYPE_DESCRIPTOR_POOL_CREATE_INFO;
        poolInfo.poolSizeCount = 1;
        poolInfo.pPoolSizes = &poolSize;
        poolInfo.maxSets = 1;
        
        VkDescriptorPool descriptorPool;
        CHECK_VK(vkCreateDescriptorPool(device, &poolInfo, nullptr, &descriptorPool), "Descriptor pool");
        
        VkDescriptorSetAllocateInfo allocSetInfo{};
        allocSetInfo.sType = VK_STRUCTURE_TYPE_DESCRIPTOR_SET_ALLOCATE_INFO;
        allocSetInfo.descriptorPool = descriptorPool;
        allocSetInfo.descriptorSetCount = 1;
        allocSetInfo.pSetLayouts = &descriptorSetLayout;
        
        VkDescriptorSet descriptorSet;
        CHECK_VK(vkAllocateDescriptorSets(device, &allocSetInfo, &descriptorSet), "Descriptor set");
        
        VkDescriptorBufferInfo bufferInfoDesc{};
        bufferInfoDesc.buffer = buffer;
        bufferInfoDesc.offset = 0;
        bufferInfoDesc.range = dataSize;
        
        VkWriteDescriptorSet descriptorWrite{};
        descriptorWrite.sType = VK_STRUCTURE_TYPE_WRITE_DESCRIPTOR_SET;
        descriptorWrite.dstSet = descriptorSet;
        descriptorWrite.dstBinding = 0;
        descriptorWrite.descriptorCount = 1;
        descriptorWrite.descriptorType = VK_DESCRIPTOR_TYPE_STORAGE_BUFFER;
        descriptorWrite.pBufferInfo = &bufferInfoDesc;
        
        vkUpdateDescriptorSets(device, 1, &descriptorWrite, 0, nullptr);
        
        // 13. Command buffer
        VkCommandPoolCreateInfo cmdPoolInfo{};
        cmdPoolInfo.sType = VK_STRUCTURE_TYPE_COMMAND_POOL_CREATE_INFO;
        cmdPoolInfo.queueFamilyIndex = computeQueueFamily;
        cmdPoolInfo.flags = VK_COMMAND_POOL_CREATE_RESET_COMMAND_BUFFER_BIT;
        
        VkCommandPool commandPool;
        CHECK_VK(vkCreateCommandPool(device, &cmdPoolInfo, nullptr, &commandPool), "Command pool");
        
        VkCommandBufferAllocateInfo cmdAllocInfo{};
        cmdAllocInfo.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_ALLOCATE_INFO;
        cmdAllocInfo.commandPool = commandPool;
        cmdAllocInfo.level = VK_COMMAND_BUFFER_LEVEL_PRIMARY;
        cmdAllocInfo.commandBufferCount = 1;
        
        VkCommandBuffer commandBuffer;
        CHECK_VK(vkAllocateCommandBuffers(device, &cmdAllocInfo, &commandBuffer), "Command buffer");
        
        // 14. Record commands
        VkCommandBufferBeginInfo beginInfo{};
        beginInfo.sType = VK_STRUCTURE_TYPE_COMMAND_BUFFER_BEGIN_INFO;
        beginInfo.flags = VK_COMMAND_BUFFER_USAGE_ONE_TIME_SUBMIT_BIT;
        
        vkBeginCommandBuffer(commandBuffer, &beginInfo);
        vkCmdBindPipeline(commandBuffer, VK_PIPELINE_BIND_POINT_COMPUTE, pipeline);
        vkCmdBindDescriptorSets(commandBuffer, VK_PIPELINE_BIND_POINT_COMPUTE, pipelineLayout, 0, 1, &descriptorSet, 0, nullptr);
        
        // Push constants
        struct PushConstants {
            uint32_t n;
            uint32_t max_iterations;
            float scale;
        } pushConstants = {N, maxIter, 1.0f};
        
        vkCmdPushConstants(commandBuffer, pipelineLayout, VK_SHADER_STAGE_COMPUTE_BIT, 0, sizeof(pushConstants), &pushConstants);
        
        // Dispatch
        uint32_t groupCountX = (N + 15) / 16;
        uint32_t groupCountY = (N + 15) / 16;
        vkCmdDispatch(commandBuffer, groupCountX, groupCountY, 1);
        vkEndCommandBuffer(commandBuffer);
        
        // 15. Submit
        VkSubmitInfo submitInfo{};
        submitInfo.sType = VK_STRUCTURE_TYPE_SUBMIT_INFO;
        submitInfo.commandBufferCount = 1;
        submitInfo.pCommandBuffers = &commandBuffer;
        
        vkQueueSubmit(computeQueue, 1, &submitInfo, VK_NULL_HANDLE);
        vkQueueWaitIdle(computeQueue);
        
        // 16. Read back results
        uint32_t* data;
        CHECK_VK(vkMapMemory(device, bufferMemory, 0, dataSize, 0, (void**)&data), "Map memory");
        
        std::vector<uint8_t> image(N * N);
        for (size_t i = 0; i < N * N; i++) {
            image[i] = (uint8_t)((data[i] * 255) / maxIter);
        }
        
        vkUnmapMemory(device, bufferMemory);
        
        auto endTime = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(endTime - startTime);
        
        // 17. Write PNG
        std::string filename = std::to_string(duration.count()) + "ms.png";
        if (write_png(filename.c_str(), N, N, image.data()) == 0) {
            std::cout << "Generated " << filename << " in " << duration.count() << " ms\n";
        }
        
        // 18. Cleanup
        vkDestroyCommandPool(device, commandPool, nullptr);
        vkDestroyDescriptorPool(device, descriptorPool, nullptr);
        vkDestroyPipeline(device, pipeline, nullptr);
        vkDestroyPipelineLayout(device, pipelineLayout, nullptr);
        vkDestroyDescriptorSetLayout(device, descriptorSetLayout, nullptr);
        vkDestroyShaderModule(device, shaderModule, nullptr);
        vkDestroyBuffer(device, buffer, nullptr);
        vkFreeMemory(device, bufferMemory, nullptr);
        vkDestroyDevice(device, nullptr);
        vkDestroyInstance(instance, nullptr);
        
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << "\n";
        return 1;
    }
    
    return 0;
}
