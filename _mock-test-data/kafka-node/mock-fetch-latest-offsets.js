const topicName = "topic1";

const topicOffsets = {
  "0": 10,
  "1": 20,
  "2": 30
};

const response = {
  [topicName]: topicOffsets
};

module.exports = {
  topicName,
  topicOffsets,
  response
};
