#!/usr/bin/env python3

import socket
import multiprocessing
import subprocess
import psutil

def get_local_ip():
    """Get the local IP of this machine."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    finally:
        s.close()
    return ip

def detect_total_cpu():
    """Return total logical CPU cores."""
    return multiprocessing.cpu_count()

def detect_free_cpu():
    """Estimate free CPU cores using psutil."""
    total = multiprocessing.cpu_count()
    usage_percent = psutil.cpu_percent(interval=0.1)
    free_cores = total * (100 - usage_percent) / 100
    return max(0, free_cores)

def detect_gpus():
    """Detect number of NVIDIA GPUs using nvidia-smi."""
    try:
        out = subprocess.run(
            ["nvidia-smi", "--query-gpu=index,memory.total", "--format=csv,noheader,nounits"],
            capture_output=True, text=True
        )
        gpus = [line.split(",") for line in out.stdout.strip().split("\n") if line]
        return len(gpus)
    except FileNotFoundError:
        return 0

