FROM redis:alpine

COPY ./config/redis.conf /etc/redis/redis.conf

CMD ["sh", "-c", "redis-server /etc/redis/redis.conf --requirepass ${REDIS_PASS}"]
