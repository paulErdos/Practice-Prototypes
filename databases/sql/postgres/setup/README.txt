#!/bin/bash

# 0: prep
read -p "First, set credentials. Ready? Press return."
vim .env
source .env
echo 'Got env vars'
echo


# 1. Build docker container
echo 'Building container'
cd dockerfile
sudo ./stop.sh
sudo ./remove-container.sh
sudo ./build.sh
cd -
echo 'Container built'
echo

# 2. Install psql -- TODO: necessary?
echo 'Installing psql'
cd psql && ./install.sh && cd -
echo 'psql installed'
echo

# 3a. Start postgres, by command 1 of 2
echo 'Starting container way 1 of 2'
# Note: this does a docker run, which creates a writeable container layer over the image, then starts it.
cd docker-command
sudo ./start-postgres.sh
cd -
echo 'Container has run way 1 of 2'
echo

# 3b. Start postgres, by command 2 of 2
echo 'Starting container way 2 of 2'
env | egrep -i post
cd dockerfile
sudo ./start.sh  # Not run, bc we've already built the container layer
sudo ./stop.sh
cd -
echo 'Container has run way 2 of 2'
echo
