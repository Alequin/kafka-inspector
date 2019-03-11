const accessGlobalKafkaConnections = require("./access-global-kafka-connections");

const fetchLatestOffsets = (topicName, kafkaConnectionConfig) => {
  const {
    kafkaNode: { offset }
  } = accessGlobalKafkaConnections(kafkaConnectionConfig);

  return new Promise((resolve, reject) => {
    offset.fetchLatestOffsets([topicName], (error, response) => {
      return error ? reject(error) : resolve(response[topicName]);
    });
  });
};

module.exports = fetchLatestOffsets;
