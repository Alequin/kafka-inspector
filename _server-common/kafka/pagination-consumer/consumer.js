const accessGlobalKafkaConnections = require("../access-global-kafka-connections");

const CONSUMER_OPTIONS = {
  autoCommit: false,
  fromOffset: true
};

const consumer = (toConsumeFrom, kafkaConnectionConfig) => {
  const {
    kafkaNode: { consumer }
  } = accessGlobalKafkaConnections(kafkaConnectionConfig);

  return consumer(toConsumeFrom, CONSUMER_OPTIONS);
};

module.exports = consumer;
