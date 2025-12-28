#!/usr/bin/env bash

docker run \
	--hostname 192.168.0.10 \
	--publish 8443:443 \
	--publish 8080:80 \
	--publish 6022:22 \
	--name gitlab \
	--restart always \
	--volume config:/etc/gitlab \
	--volume logs:/var/log/gitlab \
	--volume data:/var/opt/gitlab \
	--pull=never \
	gitlab/gitlab-ce \
