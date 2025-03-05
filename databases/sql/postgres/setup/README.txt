#!/bin/bash

# 0: prep
read -p "First, set credentials. Ready? Press return. "
vim .env
source .env
echo 'Got env vars'
echo


# 1. Build docker image
echo 'Building image'
echo 'Setting up to build...'
cd dockerfile
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

# 2. Install psql -- TODO: necessary?
#echo 'Installing psql'
#cd psql && ./install.sh && cd -
#echo 'psql installed'
#echo

# 3a. Start postgres, by command 1 of 2
#echo 'Starting container way 1 of 2'
# Note: this does a docker run, which creates a writeable container layer over the image, then starts it.
#cd docker-command
#sudo ./start-postgres.sh
#cd -
#echo 'Container has run way 1 of 2'
#echo

# 3b. Start postgres, by command 2 of 2
echo 'Running container'
env | egrep -i post
cd dockerfile
sudo ./run.sh
echo 'Run kickoff done'
echo 'Stopping container'
sudo ./stop.sh
echo 'Stopping done'
cd -
echo

# 3b. Start and stop the container
echo 'Starting container'
cd dockerfile
sudo ./start.sh
echo 'Container has started'
echo 'Stopping container'
sudo ./stop.sh
cd -
echo 'Container has stopped'
echo


