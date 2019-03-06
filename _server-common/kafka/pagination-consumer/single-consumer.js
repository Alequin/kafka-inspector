const accessGlobalKafkaConnections = require("../access-global-kafka-connections");
const consumeMessages = require("./consume-messages");

const CONSUMER_OPTIONS = {
  autoCommit: false,
  fromOffset: true
};

const singleConsumer = async ({ topicName, partition, offsetRange }) => {
  const minOffset = Math.max(offsetRange.min, 0);

  const {
    kafkaNode: { consumer }
  } = accessGlobalKafkaConnections();

  const consumerToUse = consumer(
    [{ topic: topicName, partition, offset: minOffset }],
    CONSUMER_OPTIONS
  );

  return await consumeMessages(consumerToUse, offsetRange.max);
};

module.exports = singleConsumer;
