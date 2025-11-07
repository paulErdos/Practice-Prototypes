#!/usr/bin/env python3

# 680m_opencl.py
import pyopencl as cl
import numpy as np

def main():
    # Pick a platform that contains an AMD GPU.
    plat = None
    for p in cl.get_platforms():
        if 'AMD' in p.name:
            plat = p
            break
    if not plat:
        raise RuntimeError('No AMD OpenCL platform found')

    # Pick the first GPU device on that platform
    dev = [d for d in plat.get_devices() if d.type & cl.device_type.GPU][0]
    print(f'Using device: {dev.name}')

    ctx = cl.Context

