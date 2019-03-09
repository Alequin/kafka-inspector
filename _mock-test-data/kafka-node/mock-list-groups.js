const mockConsumerGroups = require("../data/mock-consumer-groups");

const response = {
  [mockConsumerGroups.consumerGroup1]: "consumer",
  [mockConsumerGroups.consumerGroup2]: ""
};

module.exports = {
  response
};
