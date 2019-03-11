const mockTopic = require("mock-test-data/data/mock-topics");
const mockTopicOffsets = require("mock-test-data/data/mock-topic-offsets");
jest.mock("server-common/kafka/fetch-latest-offsets-with-cache");
const fetchLatestOffsetsWithCache = require("server-common/kafka/fetch-latest-offsets-with-cache");

fetchLatestOffsetsWithCache.mockImplementation(
  jest.requireActual("server-common/kafka/fetch-latest-offsets-with-cache")
);

jest.mock("server-common/kafka/access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");

accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp()
);

const latestOffsetsResolver = require("./latest-offsets-resolver");

describe("latestOffsetsResolver", () => {
  const mockContext = { kafkaConnectionConfig: { kafkaBroker: [] } };

  beforeEach(() => {
    fetchLatestOffsetsWithCache.mockClear();
  });

  it("Should return the specific latest offset for the current partition", async () => {
    const targetPartition1 = 0;
    const expected1 = mockTopicOffsets[targetPartition1];
    const actual1 = await latestOffsetsResolver(
      {
        partitionNumber: 0,
        metadata: { topic: mockTopic.topic1 }
      },
      {},
      mockContext
    );

    expect(actual1).toEqual(expected1);

    // -------

    const targetPartition2 = 0;
    const expected2 = mockTopicOffsets[targetPartition2];
    const actual2 = await latestOffsetsResolver(
      {
        partitionNumber: 0,
        metadata: { topic: mockTopic.topic1 }
      },
      {},
      mockContext
    );

    expect(actual2).toEqual(expected2);
  });

  it("Uses the cached version of fetchLatestOffsets, passing the topic name as an argument", async () => {
    await latestOffsetsResolver(
      {
        partitionNumber: 0,
        metadata: { topic: mockTopic.topic1 }
      },
      {},
      mockContext
    );

    expect(fetchLatestOffsetsWithCache).toBeCalledTimes(1);
    expect(fetchLatestOffsetsWithCache).toBeCalledWith(
      mockTopic.topic1,
      mockContext.kafkaConnectionConfig
    );
  });
});
