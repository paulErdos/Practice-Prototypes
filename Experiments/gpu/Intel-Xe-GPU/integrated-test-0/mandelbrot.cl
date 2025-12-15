__kernel void mandelbrot(__global uchar* output,
                         const int n,
                         const int max_iter,
                         const float xmin,
                         const float xmax,
                         const float ymin,
                         const float ymax) {
    int i = get_global_id(0);
    int j = get_global_id(1);

    float x0 = xmin + (xmax - xmin) * i / (float)(n-1);
    float y0 = ymin + (ymax - ymin) * j / (float)(n-1);

    float x = 0.0f, y = 0.0f;
    int iter = 0;
    while (x*x + y*y <= 4.0f && iter < max_iter) {
        float xtemp = x*x - y*y + x0;
        y = 2.0f*x*y + y0;
        x = xtemp;
        iter++;
    }
    output[j*n + i] = (uchar)(255 * iter / max_iter);
}

