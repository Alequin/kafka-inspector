const mockTopics = require("../data/mock-topics");

const mockPartitionData = partitionId => {
  return {
    partitionId,
    partitionErrorCode: 0,
    leader: 1,
    replicas: [3, 1, 2],
    isr: [1, 3, 2]
  };
};

module.exports.response = {
  topics: [
    {
      topics: mockTopics.topic1,
      partitions: [mockPartitionData(0), mockPartitionData(1)]
    }
  ]
};
