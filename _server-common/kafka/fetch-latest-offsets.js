const accessGlobalKafkaConnections = require("./access-global-kafka-connections");

const fetchLatestOffsets = topicName => {
  const {
    kafkaNode: { offset }
  } = accessGlobalKafkaConnections();

  return new Promise((resolve, reject) => {
    offset.fetchLatestOffsets([topicName], (error, response) => {
      return error ? reject(error) : resolve(response[topicName]);
    });
  });
};

module.exports = fetchLatestOffsets;
