const accessKafkaConnections = require("../access-kafka-connections");

const fetchLatestOffsets = topicName => {
  const {
    kafkaNode: { offset }
  } = accessKafkaConnections();

  return new Promise((resolve, reject) => {
    offset.fetchLatestOffsets([topicName], (error, response) => {
      return error ? reject(error) : resolve(response[topicName]);
    });
  });
};

module.exports = fetchLatestOffsets;
