const mockBrokers = {
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

const mockMetadata = {
  metadata: {
    topic1: {
      "0": mockPartitionData("topic1", 0),
      "1": mockPartitionData("topic1", 1)
    },
    "topic 2": {
      "0": mockPartitionData("topic2", 0),
      "1": mockPartitionData("topic2", 1)
    },
    _privateTopic1: {
      "0": mockPartitionData("_privateTopic1", 0),
      "1": mockPartitionData("_privateTopic1", 1)
    },
    __privateTopic2: {
      "0": mockPartitionData("__privateTopic2", 0),
      "1": mockPartitionData("__privateTopic2", 1)
    }
  }
};

const mockResponse = [mockBrokers, mockMetadata];

const listTopics = require("./list-topics");

describe("topics", () => {
  it("Should return a list of all topics, filtering out private topics", async () => {
    const mockKafkaConnection = {
      kafkaNode: {
        admin: {
          listTopics: callback => {
            const error = false;
            callback(error, mockResponse);
          }
        }
      }
    };

    const { topics } = await listTopics(mockKafkaConnection);
    const rawTopicObject = mockMetadata.metadata;
    expect(topics).toEqual([
      {
        name: "topic1",
        partitions: [rawTopicObject.topic1["0"], rawTopicObject.topic1["1"]]
      },
      {
        name: "topic 2",
        partitions: [
          rawTopicObject["topic 2"]["0"],
          rawTopicObject["topic 2"]["1"]
        ]
      }
    ]);
  });

  it("Should throw an error if requesting the list of topics fails", async () => {
    const mockErrorMessage = "list topics error message";
    const mockKafkaConnection = {
      kafkaNode: {
        admin: {
          listTopics: callback => {
            const error = mockErrorMessage;
            callback(error, mockResponse);
          }
        }
      }
    };

    listTopics(mockKafkaConnection).catch(error => {
      expect(error).toBe(mockErrorMessage);
    });
  });
});
