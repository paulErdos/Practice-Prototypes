#!/bin/bash

sudo groupadd docker
sudo usermod -aG docker $(whoami)

echo 'Now log out and log back in'
echo 'or?? this??? unclear??'
newgrp docker

docker run hello-world
