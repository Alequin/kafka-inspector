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
  },
  __privateTopic2: {
    "0": mockPartitionData("__privateTopic2", 0),
    "1": mockPartitionData("__privateTopic2", 1)
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

jest.mock("./utils/fetch-broker-details-and-topics-names");
const fetchBrokerDetailsAndTopicNames = require("./utils/fetch-broker-details-and-topics-names");
fetchBrokerDetailsAndTopicNames.mockResolvedValue(listTopicsResponse);

const listTopics = require("./list-topics");

describe("topics", () => {
  beforeEach(() => {
    fetchBrokerDetailsAndTopicNames.mockClear();
  });

  it("Calls fetchBrokerDetailsAndTopicNames with the given kafka config", async () => {
    const kafkaConfig = { kafkaBrokers: ["broker1:9092"] };
    await listTopics(kafkaConfig);
    expect(fetchBrokerDetailsAndTopicNames).toHaveBeenCalledTimes(1);
    expect(fetchBrokerDetailsAndTopicNames).toHaveBeenCalledWith(kafkaConfig);
  });

  it("Returns a list of all topics, filtering out private topics", async () => {
    const expected = [
      {
        name: "topic1",
        partitions: [
          {
            topic: "topic1",
            partition: 0,
            leader: 1,
            replicas: [3, 1, 2],
            isr: [1, 3, 2]
          },
          {
            topic: "topic1",
            partition: 1,
            leader: 1,
            replicas: [3, 1, 2],
            isr: [1, 3, 2]
          }
        ]
      }
    ];

    const actual = await listTopics();
    expect(actual).toEqual(expected);
  });
});
