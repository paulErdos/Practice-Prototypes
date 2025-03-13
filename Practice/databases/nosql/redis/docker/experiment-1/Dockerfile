FROM redis:latest

WORKDIR /data

VOLUME /data

# Start Redis server and log output
CMD ["sh", "-c", "mkdir -p /data && redis-server --logfile /data/redis.log --appendonly yes"]
