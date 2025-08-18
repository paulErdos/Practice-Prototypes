FROM quay.io/coreos/etcd:v3.5.13-amd64
#FROM quay.io/coreos/etcd:v3.5.13


# Copy only the scripts that are actually used inside the container
COPY start.sh /start.sh
COPY list-siblings.sh /usr/local/bin/list-siblings
COPY run.sh /usr/local/bin/run
COPY tail-logs.sh /usr/local/bin/tail-logs

# Make them executable
#RUN chmod +x /start.sh /usr/local/bin/list-siblings /usr/local/bin/run /usr/local/bin/tail-logs

# etcd client and peer ports
EXPOSE 2379 2380

# Run your startup script (instead of the stock etcd entrypoint)
CMD ["/start.sh"]

