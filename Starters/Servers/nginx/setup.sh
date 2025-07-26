#!/usr/bin/env bash

# Download and install

curl 'https://nginx.org/download/nginx-1.28.0.tar.gz' > nginx.tar.gz
gunzip -d nginx.tar.gz
tar -xvf nginx.tar
rm nginx.tar

cd n*
./configure
make
cd -

mkdir logs conf
cp nginx-1.28.0/conf/* conf/
