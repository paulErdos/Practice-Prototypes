FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    etcd \
    netcat \
    iputils-ping \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY start.sh /start.sh
COPY list-siblings.sh /usr/local/bin/list-siblings
RUN chmod +x /start.sh /usr/local/bin/list-siblings

EXPOSE 2379 2380

CMD ["/start.sh"]

