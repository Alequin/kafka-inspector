const mockGetTopicMetadata = require("mock-test-data/kafkajs/mock-get-topic-metadata");

jest.mock("server-common/kafka/access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");
accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp([
    { path: "kafkaJs.admin.getTopicMetadata", override: () => {} }
  ])
);

jest.mock("server-common/kafka/conditional-consumer/conditional-consumer");
const conditionalConsumer = require("server-common/kafka/conditional-consumer/conditional-consumer");
const conditionalConsumerResolver = require("./conditional-consumer-resolver");

describe("conditionalConsumerResolver", () => {
  const mockTopic = "topic";
  const mockPartitions = [0];
  const mockMinOffset = 0;
  const mockMaxOffset = 100;

  beforeEach(() => {
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp()
    );
  });

  it("Calls the consumer with the requested options", async () => {
    await conditionalConsumerResolver(
      {},
      {
        topicName: mockTopic,
        partitions: mockPartitions,
        minOffset: mockMinOffset,
        maxOffset: mockMaxOffset
      },
      { kafkaBrokers: ["broker"] }
    );

    expect(conditionalConsumer.mock.calls[0][0]).toEqual({
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

    await conditionalConsumerResolver(
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

  it("Returns the consumed messages as an array and the return value from conditionalConsumer", async () => {
    const returnValueToInclude = { test: "im am included in the response" };
    const mockMessages = ["message1", "message2", "message3"];
    conditionalConsumer.mockImplementation(
      (_topicOptions, _kafkaSettings, onMessageCallback) => {
        mockMessages.forEach(onMessageCallback);
        return returnValueToInclude;
      }
    );

    const expected = {
      messages: mockMessages,
      ...returnValueToInclude
    };
    const actual = await conditionalConsumerResolver(
      {},
      {
        topicName: mockTopic
      },
      { kafkaBrokers: ["broker"] }
    );

    expect(actual).toEqual(expected);
  });
});
