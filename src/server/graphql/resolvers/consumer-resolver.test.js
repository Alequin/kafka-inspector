const mockGetTopicMetadata = require("mock-test-data/kafkajs/mock-get-topic-metadata");

jest.mock("server-common/kafka/access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");
accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp([
    { path: "kafkaJs.admin.getTopicMetadata", override: () => {} }
  ])
);

jest.mock("server-common/kafka/pagination-consumer/pagination-consumer");
const paginationConsumer = require("server-common/kafka/pagination-consumer/pagination-consumer");
const consumerResolver = require("./consumer-resolver");

describe("consumerResolver", () => {
  const mockTopic = "topic";
  const mockPartitions = [0];
  const mockMinOffset = 0;
  const mockMaxOffset = 100;

  it("Calls the consumer with the requested options", async () => {
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp()
    );

    await consumerResolver(
      {},
      {
        topicName: mockTopic,
        partitions: mockPartitions,
        minOffset: mockMinOffset,
        maxOffset: mockMaxOffset
      },
      { kafkaBrokers: ["broker"] }
    );

    expect(paginationConsumer.mock.calls[0][0]).toEqual({
      topicName: mockTopic,
      partitionsToConsumerFrom: mockPartitions,
      requestedMinOffset: mockMinOffset,
      requestedMaxOffset: mockMaxOffset
    });
  });

  it("Should request all the topics partitions when users does not request specific partitions", async () => {
    const mockGetTopicMetadataFunction = jest
      .fn()
      .mockResolvedValue(mockGetTopicMetadata.response);
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp([
        {
          path: "kafkaJs.admin.getTopicMetadata",
          override: mockGetTopicMetadataFunction
        }
      ])
    );

    await consumerResolver(
      {},
      {
        topicName: mockTopic,
        minOffset: mockMinOffset,
        maxOffset: mockMaxOffset
      },
      { kafkaBrokers: ["broker"] }
    );

    expect(mockGetTopicMetadataFunction).toBeCalledTimes(1);
    expect(mockGetTopicMetadataFunction).toHaveBeenCalledWith({
      topics: [mockTopic]
    });
  });

  it("Returns an array of the values passed to the paginationConsumer callback", async () => {
    const mockMessages = ["message1", "message2", "message3"];
    paginationConsumer.mockImplementation(
      (_topicOptions, _kafkaSettings, onMessageCallback) => {
        mockMessages.forEach(onMessageCallback);
      }
    );

    const actual = await consumerResolver(
      {},
      {
        topicName: mockTopic
      },
      { kafkaBrokers: ["broker"] }
    );

    expect(actual).toEqual(mockMessages);
  });
});
