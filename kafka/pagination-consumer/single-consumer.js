const kafka = require("kafka-node");
const accessKafkaConnections = require("../access-kafka-connections");
const consumeMessages = require("./consume-messages");

const CONSUMER_OPTIONS = {
  autoCommit: false,
  fromOffset: true
};

const singleConsumer = async ({ topic, partition, offsetRange }) => {
  const minOffset = Math.max(offsetRange.min, 0);

  if (minOffset > offsetRange.max)
    throw new Error(
      `Min offset (${minOffset}) cannot be greater than the max offset((${
        offsetRange.max
      }))`
    );

  const {
    kafkaNode: { client }
  } = accessKafkaConnections();

  const consumer = new kafka.Consumer(
    client,
    [{ topic, partition, offset: offsetRange.min }],
    CONSUMER_OPTIONS
  );

  return await consumeMessages(consumer, offsetRange.max);
};

module.exports = singleConsumer;
