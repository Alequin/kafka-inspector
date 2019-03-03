const accessKafkaConnections = require("./access-kafka-connections");

const mapConsumerGroupsToList = consumerGroupsObject => {
  return Object.keys(consumerGroupsObject);
};

const listConsumerGroups = async () => {
  const { kafkaNode } = accessKafkaConnections();

  return new Promise((resolve, reject) => {
    kafkaNode.admin.listGroups((error, response) => {
      error ? reject(error) : resolve(mapConsumerGroupsToList(response));
    });
  });
};

module.exports = listConsumerGroups;
