#include <CL/sycl.hpp>
int main() {
    sycl::queue q(sycl::gpu_selector{});
    std::vector<int> data(1024, 1);
    {
        sycl::buffer<int> buf(data.data(), data.size());
        q.submit([&](sycl::handler& h){
            auto acc = buf.get_access<sycl::access::mode::read_write>(h);
            h.parallel_for(buf.get_range(), [=](sycl::id<1> i){ acc[i] += 1; });
        });
    }
    return 0;
}

