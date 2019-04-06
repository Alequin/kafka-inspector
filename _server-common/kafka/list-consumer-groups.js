const kafkaNodeAdmin = require("./kafka-connections/kafka-node-admin");

const mapConsumerGroupsToList = consumerGroupsObject => {
  return Object.keys(consumerGroupsObject);
};

const resolveConsumerGroups = admin =>
  new Promise((resolve, reject) => {
    admin.listGroups((error, response) => {
      error ? reject(error) : resolve(mapConsumerGroupsToList(response));
    });
  });

const listConsumerGroups = async kafkaConnectionConfig => {
  return kafkaNodeAdmin(kafkaConnectionConfig, resolveConsumerGroups);
};

module.exports = listConsumerGroups;
