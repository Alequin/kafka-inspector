const accessGlobalKafkaConnections = require("../access-global-kafka-connections");

const fetchBrokerDetailsAndTopicNames = async kafkaConnectionConfig => {
  const { kafkaNode } = accessGlobalKafkaConnections(kafkaConnectionConfig);

  return new Promise((resolve, reject) => {
    kafkaNode.admin.listTopics((error, response) => {
      error ? reject(error) : resolve(response);
    });
  });
};

module.exports = fetchBrokerDetailsAndTopicNames;
