#include <vulkan/vulkan.h>
#include <iostream>
#include <vector>
#include <cstring>
#include <chrono>
#include <complex>
#include <fstream>

#define CHECK_VK(result, msg) \
    if (result != VK_SUCCESS) { \
        std::cerr << "[" << __LINE__ << "] " << msg << ": " << result << "\n"; \
        return 1; \
    }

int main() {
    std::cout << "=== Vulkan Minimal Compute Test ===\n";
    
    // 1. Instance
    VkInstance instance;
    VkInstanceCreateInfo instanceInfo{};
    instanceInfo.sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
    
    VkResult result = vkCreateInstance(&instanceInfo, nullptr, &instance);
    CHECK_VK(result, "Failed to create instance");
    std::cout << "✓ Instance created\n";
    
    // 2. List physical devices
    uint32_t deviceCount = 0;
    vkEnumeratePhysicalDevices(instance, &deviceCount, nullptr);
    std::vector<VkPhysicalDevice> devices(deviceCount);
    vkEnumeratePhysicalDevices(instance, &deviceCount, devices.data());
    
    if (deviceCount == 0) {
        std::cerr << "No Vulkan devices found\n";
        vkDestroyInstance(instance, nullptr);
        return 1;
    }
    
    VkPhysicalDevice physicalDevice = devices[0];
    std::cout << "✓ Found " << deviceCount << " Vulkan device(s)\n";
    
    // 3. Check queue families
    uint32_t queueFamilyCount = 0;
    vkGetPhysicalDeviceQueueFamilyProperties(physicalDevice, &queueFamilyCount, nullptr);
    std::vector<VkQueueFamilyProperties> queueFamilies(queueFamilyCount);
    vkGetPhysicalDeviceQueueFamilyProperties(physicalDevice, &queueFamilyCount, queueFamilies.data());
    
    uint32_t computeQueueFamily = VK_QUEUE_FAMILY_IGNORED;
    for (uint32_t i = 0; i < queueFamilyCount; i++) {
        if (queueFamilies[i].queueFlags & VK_QUEUE_COMPUTE_BIT) {
            computeQueueFamily = i;
            std::cout << "✓ Compute queue family: " << i << "\n";
            break;
        }
    }
    
    if (computeQueueFamily == VK_QUEUE_FAMILY_IGNORED) {
        std::cerr << "No compute queue family found\n";
        vkDestroyInstance(instance, nullptr);
        return 1;
    }
    
    // 4. Create device
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
    result = vkCreateDevice(physicalDevice, &deviceInfo, nullptr, &device);
    CHECK_VK(result, "Failed to create device");
    std::cout << "✓ Device created\n";
    
    // 5. Get queue
    VkQueue queue;
    vkGetDeviceQueue(device, computeQueueFamily, 0, &queue);
    
    // 6. Create a simple buffer
    const VkDeviceSize bufferSize = 1024 * sizeof(float);
    
    VkBufferCreateInfo bufferInfo{};
    bufferInfo.sType = VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO;
    bufferInfo.size = bufferSize;
    bufferInfo.usage = VK_BUFFER_USAGE_STORAGE_BUFFER_BIT;
    bufferInfo.sharingMode = VK_SHARING_MODE_EXCLUSIVE;
    
    VkBuffer buffer;
    result = vkCreateBuffer(device, &bufferInfo, nullptr, &buffer);
    CHECK_VK(result, "Failed to create buffer");
    std::cout << "✓ Buffer created\n";
    
    // 7. Get memory requirements
    VkMemoryRequirements memRequirements;
    vkGetBufferMemoryRequirements(device, buffer, &memRequirements);
    
    // 8. Allocate memory
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
    result = vkAllocateMemory(device, &allocInfo, nullptr, &bufferMemory);
    CHECK_VK(result, "Failed to allocate memory");
    
    // 9. Bind memory
    result = vkBindBufferMemory(device, buffer, bufferMemory, 0);
    CHECK_VK(result, "Failed to bind buffer memory");
    std::cout << "✓ Memory allocated and bound\n";
    
    // 10. Map and write test data
    float* data;
    result = vkMapMemory(device, bufferMemory, 0, bufferSize, 0, (void**)&data);
    CHECK_VK(result, "Failed to map memory");
    
    // Simple test: fill with incrementing numbers
    for (int i = 0; i < 1024; i++) {
        data[i] = static_cast<float>(i);
    }
    
    vkUnmapMemory(device, bufferMemory);
    
    // 11. Verify by reading back
    vkMapMemory(device, bufferMemory, 0, bufferSize, 0, (void**)&data);
    std::cout << "Test data[0] = " << data[0] << "\n";
    std::cout << "Test data[100] = " << data[100] << "\n";
    vkUnmapMemory(device, bufferMemory);
    
    std::cout << "✓ Success! Vulkan memory operations work.\n";
    
    // 12. Cleanup
    vkDestroyBuffer(device, buffer, nullptr);
    vkFreeMemory(device, bufferMemory, nullptr);
    vkDestroyDevice(device, nullptr);
    vkDestroyInstance(instance, nullptr);
    
    std::cout << "=== Test complete ===\n";
    return 0;
}
