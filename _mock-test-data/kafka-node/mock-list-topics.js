const mockBrokers = require("../data/mock-brokers");
const mockTopics = require("../data/mock-topics");

const mockPartitionData = (topicName, partition) => {
  return {
    topic: topicName,
    partition,
    leader: 1,
    replicas: [3, 1, 2],
    isr: [1, 3, 2]
  };
};

const metadata = {
  [mockTopics.topic1]: {
    "0": mockPartitionData(mockTopics.topic1, 0),
    "1": mockPartitionData(mockTopics.topic1, 1)
  },
  [mockTopics.topic2]: {
    "0": mockPartitionData(mockTopics.topic2, 0),
    "1": mockPartitionData(mockTopics.topic2, 1)
  },
  [mockTopics.privateTopic1]: {
    "0": mockPartitionData([mockTopics.privateTopic1], 0),
    "1": mockPartitionData([mockTopics.privateTopic1], 1)
  },
  [mockTopics.privateTopic2]: {
    "0": mockPartitionData([mockTopics.privateTopic2], 0),
    "1": mockPartitionData([mockTopics.privateTopic2], 1)
  }
};

const response = [
  mockBrokers,
  { metadata, clusterMetadata: { controllerId: 2 } }
];

module.exports = {
  response,
  metadata
};
