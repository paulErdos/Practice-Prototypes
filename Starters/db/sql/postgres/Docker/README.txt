#!/bin/bash

# 0: prep
# Run setup.sh once
# Then run this file


# 1. Build docker image
echo 'Building image'
echo 'Setting up to build...'
cd postgres-docker
echo 'Halting if needed'
./stop.sh
echo 'Halt done'
echo 'Removing as needed'
./remove-container.sh
echo 'Removing done'
echo '... Initiating build'
./build.sh
cd -
echo 'Image built'
echo


# 2. Start postgres
echo 'Running container'
env | egrep -i post
cd postgres-docker
./run.sh
echo 'Run kickoff done'
echo 'Stopping container'
./stop.sh
echo 'Stopping done'
cd -
echo


# 3. Start and stop the container
echo 'Starting container'
cd postgres-docker
./start.sh
echo 'Container has started'
echo 'Stopping container'
./stop.sh
cd -
echo 'Container has stopped'
echo

