const mockConsumerGroups = require("../data/mock-consumer-groups");

const response = {
  [mockConsumerGroups.consumerGroup1]: "consumer",
  [mockConsumerGroups.consumerGroup2]: "",
  [mockConsumerGroups.consumerGroup3]: "consumer"
};

module.exports = {
  response
};
