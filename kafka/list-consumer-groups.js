const { kafkaNode } = require("./kafka-connection");

const listConsumerGroups = async () => {
  return new Promise((resolve, reject) => {
    kafkaNode.admin.listGroups((error, response) => {
      error ? reject(error) : resolve(response);
    });
  });
};

module.exports = listConsumerGroups;
