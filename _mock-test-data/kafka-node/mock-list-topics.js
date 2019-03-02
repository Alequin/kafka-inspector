const brokers = {
  "1": { nodeId: 1, host: "broker1", port: 9092 },
  "2": { nodeId: 2, host: "broker2", port: 9092 },
  "3": { nodeId: 3, host: "broker3", port: 9092 }
};

const mockPartitionData = (topicName, partition) => {
  return {
    topic: topicName,
    partition,
    leader: 1,
    replicas: [3, 1, 2],
    isr: [1, 3, 2]
  };
};

const topic1 = "topic1";
const topic2 = "topic-2";

const metadata = {
  [topic1]: {
    "0": mockPartitionData(topic1, 0),
    "1": mockPartitionData(topic1, 1)
  },
  [topic2]: {
    "0": mockPartitionData(topic2, 0),
    "1": mockPartitionData(topic2, 1)
  },
  _privateTopic1: {
    "0": mockPartitionData("_privateTopic1", 0),
    "1": mockPartitionData("_privateTopic1", 1)
  },
  __privateTopic2: {
    "0": mockPartitionData("__privateTopic2", 0),
    "1": mockPartitionData("__privateTopic2", 1)
  }
};

const response = [brokers, { metadata }];

module.exports = {
  response,
  metadata,
  topic1,
  topic2
};
