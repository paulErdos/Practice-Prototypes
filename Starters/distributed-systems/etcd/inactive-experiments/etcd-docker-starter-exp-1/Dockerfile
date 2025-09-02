FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    etcd \
    etcd-client \
    netcat \
    iputils-ping \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY start-etcd.sh /start-etcd.sh
#COPY list-siblings.sh /list-siblings
#RUN chmod +x /start.sh /list-siblings

EXPOSE 2379 2380

CMD ["/start-etcd.sh"]

