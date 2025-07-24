#!/bin/bash

# 0: prep
read -p "First, set credentials. Ready? Press return. "
vim template.env
mv template.env .env
source .env
echo 'Got env vars'
echo


# 1. Build docker image
echo 'Building image'
echo 'Setting up to build...'
cd Docker
echo 'Halting if needed'
sudo ./stop.sh
echo 'Halt done'
echo 'Removing as needed'
sudo ./remove-container.sh
echo 'Removing done'
echo '... Initiating build'
sudo ./build.sh
cd -
echo 'Image built'
echo


# 2. Start postgres
echo 'Running container'
env | egrep -i post
cd Dockerfile
sudo ./run.sh
echo 'Run kickoff done'
echo 'Stopping container'
sudo ./stop.sh
echo 'Stopping done'
cd -
echo


# 3. Start and stop the container
echo 'Starting container'
cd Docker
sudo ./start.sh
echo 'Container has started'
echo 'Stopping container'
sudo ./stop.sh
cd -
echo 'Container has stopped'
echo

