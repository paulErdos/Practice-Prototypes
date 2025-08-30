# Extract etcd from official image
FROM quay.io/coreos/etcd:v3.5.13-amd64 AS etcd-source

# Use Ubuntu with shell tools
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y \
    netcat \
    curl \
    hostname \
    && rm -rf /var/lib/apt/lists/*

# Copy etcd binaries from official image
COPY --from=etcd-source /usr/local/bin/etcd /usr/local/bin/etcd
COPY --from=etcd-source /usr/local/bin/etcdctl /usr/local/bin/etcdctl

# Copy your scripts
COPY start-etcd.sh /start-etcd.sh
#COPY list-siblings.sh /usr/local/bin/list-siblings
COPY run.sh /usr/local/bin/run
COPY tail-logs.sh /usr/local/bin/tail-logs
#RUN chmod +x /start.sh /usr/local/bin/list-siblings /usr/local/bin/run /usr/local/bin/tail-logs

EXPOSE 2379 2380
CMD ["/start-etcd.sh"]
