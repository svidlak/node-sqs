const { enqueueMessage, dequeueMessage } = require('../utils/redis');

const getFromQueue = (queueName) => dequeueMessage(queueName);

const postToQueue = ({ queueName, message }) => enqueueMessage(queueName, message)

module.exports = { getFromQueue, postToQueue };