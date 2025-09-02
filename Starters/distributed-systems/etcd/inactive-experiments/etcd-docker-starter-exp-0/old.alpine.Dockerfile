FROM alpine:latest

# Install etcd, bash, and networking tools
RUN apk add --no-cache \
    etcd \
    etcdctl \
    bash \
    netcat-openbsd \
    curl \
    grep \
    hostname \
    coreutils

# Copy scripts
COPY start.sh /start.sh
COPY list-siblings.sh /usr/local/bin/list-siblings
COPY run.sh /usr/local/bin/run
COPY tail-logs.sh /usr/local/bin/tail-logs

# Make them executable
RUN chmod +x /start.sh /usr/local/bin/list-siblings /usr/local/bin/run /usr/local/bin/tail-logs

# etcd client and peer ports
EXPOSE 2379 2380

# Run your startup script
CMD ["/start.sh"]
