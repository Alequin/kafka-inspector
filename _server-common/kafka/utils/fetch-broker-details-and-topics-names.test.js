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

jest.mock("kafka-node");
const kafkaNode = require("kafka-node");

const mockClient = jest.fn().mockImplementation();
const mockAdmin = jest.fn();

kafkaNode.KafkaClient = mockClient;
kafkaNode.Admin = mockAdmin;

const fetchBrokerDetailsAndTopicNames = require("./fetch-broker-details-and-topics-names");

describe("fetchBrokerDetailsAndTopicNames", () => {
  it("Should resolve the response from listTopics", async () => {
    mockAdmin.mockImplementation(function() {
      this.listTopics = callback => {
        const error = false;
        callback(error, listTopicsResponse);
      };
    });

    const expected = listTopicsResponse;
    const actual = await fetchBrokerDetailsAndTopicNames({
      kafkaBrokers: ["broker1:9092"]
    });
    expect(actual).toBe(expected);
  });

  it("Should throw an error if listTopics fails", done => {
    const mockErrorMessage = "list topics error message";
    mockAdmin.mockImplementation(function() {
      this.listTopics = callback => {
        const error = mockErrorMessage;
        callback(error, listTopicsResponse);
      };
    });

    fetchBrokerDetailsAndTopicNames({
      kafkaBrokers: ["broker1:9092"]
    }).catch(error => {
      expect(error).toBe(mockErrorMessage);
      done();
    });
  });
});
