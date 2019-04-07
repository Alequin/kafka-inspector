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
  KafkaClient: jest.fn().mockImplementation(function() {
    this.close = () => {};
  }),
  Admin: jest.fn().mockImplementation(function() {
    this.listTopics = callback => {
      const error = false;
      callback(error, listTopicsResponse);
    };

    this.listGroups = callback => {
      const error = false;
      callback(error, {
        consumerGroup1: "consumer",
        "consumer-group-1": "consumer"
      });
    };

    const describeGroupsReturnValue = require("./kafka-node/describe-groups");
    this.describeGroups = (_groupNames, callback) => {
      const error = false;
      callback(error, describeGroupsReturnValue);
    };
  }),
  Offset: jest.fn().mockImplementation(function() {
    this.fetchLatestOffsets = (_topicNames, callback) => {
      const error = false;
      const offsetDetails = {
        topic1: {
          "0": 10,
          "1": 20,
          "2": 30
        }
      };
      callback(error, offsetDetails);
    };
  }),
  Consumer: jest.fn(),
  ConsumerGroup: jest.fn().mockImplementation(function() {
    this.on = (_event, callback) => {};
    this.close = () => {};
  })
};

module.exports = kafkaNode;
