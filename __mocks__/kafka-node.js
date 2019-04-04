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
  topic1: {
    "0": mockPartitionData("topic1", 0),
    "1": mockPartitionData("topic1", 1)
  },
  _privateTopic1: {
    "0": mockPartitionData("_privateTopic1", 0),
    "1": mockPartitionData("_privateTopic1", 1)
  }
};

const listTopicsResponse = [
  {
    "1": { nodeId: 1, host: "broker1", port: 9092 },
    "2": { nodeId: 2, host: "broker2", port: 9092 },
    "3": { nodeId: 3, host: "broker3", port: 9092 }
  },
  { metadata, clusterMetadata: { controllerId: 2 } }
];

const kafkaNode = {
  KafkaClient: jest.fn(),
  Admin: jest.fn().mockImplementation(function() {
    this.listTopics = callback => {
      const error = false;
      callback(error, listTopicsResponse);
    };
  })
};

module.exports = kafkaNode;
