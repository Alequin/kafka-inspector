const accessGlobalKafkaConnections = require("./access-global-kafka-connections");

const mapConsumerGroupsToList = consumerGroupsObject => {
  return Object.keys(consumerGroupsObject);
};

const listConsumerGroups = async () => {
  const { kafkaNode } = accessGlobalKafkaConnections();

  return new Promise((resolve, reject) => {
    kafkaNode.admin.listGroups((error, response) => {
      error ? reject(error) : resolve(mapConsumerGroupsToList(response));
    });
  });
};

module.exports = listConsumerGroups;
