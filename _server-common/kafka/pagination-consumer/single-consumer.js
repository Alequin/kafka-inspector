const kafka = require("kafka-node");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");
const consumeMessages = require("./consume-messages");

const CONSUMER_OPTIONS = {
  autoCommit: false,
  fromOffset: true
};

const singleConsumer = async ({ topicName, partition, offsetRange }) => {
  const minOffset = Math.max(offsetRange.min, 0);

  const {
    kafkaNode: { client }
  } = accessGlobalKafkaConnections();

  const consumer = new kafka.Consumer(
    client,
    [{ topic: topicName, partition, offset: minOffset }],
    CONSUMER_OPTIONS
  );

  return await consumeMessages(consumer, offsetRange.max);
};

module.exports = singleConsumer;
