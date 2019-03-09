const mockConsumerGroups = require("../data/mock-consumer-groups");
const consumerGroupInformation = require("../data/mock-consumer-group-information");

const response = {
  [mockConsumerGroups.consumerGroup1]: consumerGroupInformation
};

module.exports = {
  response
};
