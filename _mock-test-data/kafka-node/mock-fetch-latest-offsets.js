const mockTopics = require("../data/mock-topics");
const mockTopicOffsets = require("../data/mock-topic-offsets");

const response = {
  [mockTopics.topic1]: mockTopicOffsets
};

module.exports = {
  response
};
