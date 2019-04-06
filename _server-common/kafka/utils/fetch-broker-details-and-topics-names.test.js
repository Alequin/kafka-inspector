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
  privateTopic1: {
    "0": mockPartitionData("_privateTopic1", 0),
    "1": mockPartitionData("_privateTopic1", 1)
  }
};

const listTopicsResponse = [
  {
    "1": { nodeId: 1, host: "broker1", port: 9092 }
  },
  { metadata, clusterMetadata: { controllerId: 2 } }
];

jest.mock("../kafka-connections/kafka-node-admin");
const kafkaNodeAdmin = require("../kafka-connections/kafka-node-admin");

const fetchBrokerDetailsAndTopicNames = require("./fetch-broker-details-and-topics-names");

describe("fetchBrokerDetailsAndTopicNames", () => {
  it("Should resolve the response from listTopics", async () => {
    kafkaNodeAdmin.mockImplementation((_kafkaConfig, callback) => {
      const mockAdmin = {
        listTopics: callback => {
          const error = false;
          callback(error, listTopicsResponse);
        }
      };

      return callback(mockAdmin);
    });

    const expected = listTopicsResponse;
    const actual = await fetchBrokerDetailsAndTopicNames({
      kafkaBrokers: ["broker1:9092"]
    });
    expect(actual).toBe(expected);
  });

  it("Should throw an error if listTopics fails", done => {
    const mockErrorMessage = "list topics error message";
    kafkaNodeAdmin.mockImplementation((_kafkaConfig, callback) => {
      const mockAdmin = {
        listTopics: callback => {
          const error = mockErrorMessage;
          callback(error, listTopicsResponse);
        }
      };

      return callback(mockAdmin);
    });

    fetchBrokerDetailsAndTopicNames({
      kafkaBrokers: ["broker1:9092"]
    }).catch(error => {
      expect(error).toBe(mockErrorMessage);
      done();
    });
  });
});
