const Redis = require('ioredis');
const redis = new Redis({
    host: process.env.REDIS_URL,
    port: 6379
});

const enqueueMessage = async (key, message) => redis.lpush(key, message);

const dequeueMessage = async (key) => redis.lpop(key);

const shutdown = () => redis.disconnect()

module.exports = { enqueueMessage, dequeueMessage, shutdown }