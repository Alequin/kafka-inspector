const { forEach } = require("lodash");
const mockGetTopicMetadata = require("mock-test-data/kafkajs/mock-get-topic-metadata");

jest.mock("server-common/kafka/access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");
accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp([
    { path: "kafkaJs.admin.getTopicMetadata", override: () => {} }
  ])
);

const { JSON_ENCODING } = require("../constants/parsing-options");
jest.mock("server-common/kafka/targeted-consumer/targeted-consumer");
const targetedConsumer = require("server-common/kafka/targeted-consumer/targeted-consumer");

jest.mock("graphql-subscriptions");
const { PubSub } = require("graphql-subscriptions");

const mockAsyncIterator = jest.fn();
const mockAsyncIteratorReturnValue = Symbol();
const mockPublish = jest.fn();
const mockSubscribedEvents = {};

PubSub.mockImplementation(() => {
  return {
    ee: {
      _events: mockSubscribedEvents
    },
    asyncIterator: mockAsyncIterator.mockImplementation(subscriptionKeys => {
      subscriptionKeys.forEach(key => {
        if (!mockSubscribedEvents[key]) mockSubscribedEvents[key] = 0;
      });
      return mockAsyncIteratorReturnValue;
    }),
    publish: mockPublish
  };
});

const { EQUAL_TO } = require("../constants/comparator-options");

const conditionalConsumerResolver = require("./conditional-consumer-resolver");

describe("conditionalConsumerResolver", () => {
  jest.useFakeTimers();
  const mockTopic = "topic";
  const mockPartitions = [0];
  const mockMinOffset = 0;
  const mockMaxOffset = 100;

  beforeEach(() => {
    mockPublish.mockClear();
    targetedConsumer.mockClear();
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
        maxOffset: mockMaxOffset,
        conditions: {
          encoding: JSON_ENCODING,
          conditions: []
        }
      },
      { kafkaBrokers: ["broker"] }
    );

    expect(targetedConsumer.mock.calls[0][0]).toEqual({
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
        maxOffset: mockMaxOffset,
        conditions: {
          encoding: JSON_ENCODING,
          conditions: []
        }
      },
      { kafkaBrokers: ["broker"] }
    );

    expect(mockGetTopicMetadataFunction).toBeCalledTimes(1);
    expect(mockGetTopicMetadataFunction).toHaveBeenCalledWith({
      topics: [mockTopic]
    });
  });

  it("closes consumer if user stops listening", async () => {
    const mockConsumerClose = jest.fn();
    targetedConsumer.mockImplementation((_options, _kafkaConfig, onMessage) => {
      onMessage(
        { value: JSON.stringify({ offset: 0 }) },
        { close: mockConsumerClose }
      );
    });

    const mockTopicName = "topic";
    await conditionalConsumerResolver(
      {},
      { kafkaBrokers: ["broker"], topicName: mockTopicName }
    );

    forEach(mockSubscribedEvents, (_value, key) => {
      delete mockSubscribedEvents[key];
    });
    jest.runOnlyPendingTimers();

    expect(targetedConsumer).toHaveBeenCalledTimes(1);
    expect(targetedConsumer.mock.calls[0][0].topicName).toEqual(mockTopicName);

    expect(mockConsumerClose).toHaveBeenCalledTimes(1);
  });

  it("Publishes consumed messages as an array and the return value from targetedConsumer", async () => {
    const mockMessages = ["message1", "message2", "message3"];
    targetedConsumer.mockImplementation(
      (_topicOptions, _kafkaSettings, onMessageCallback) => {
        mockMessages.forEach(onMessageCallback);
      }
    );

    await conditionalConsumerResolver(
      {},
      {
        topicName: mockTopic
      },
      { kafkaBrokers: ["broker"] }
    );
    jest.runOnlyPendingTimers();

    expect(mockPublish.mock.calls[0][1]).toEqual({
      conditionalConsumer: {
        matchingMessagesCount: 3,
        rejectedMessagesCount: 0,
        messages: mockMessages
      }
    });
  });

  it("Filters messages by given conditions", async () => {
    const message1 = { value: JSON.stringify({ testPath: "to-match" }) };
    const message2 = { value: JSON.stringify({ testPath: "not-to-match" }) };
    const message3 = { value: JSON.stringify({ testPath: "not-to-match" }) };

    const mockMessages = [message1, message2, message3];
    targetedConsumer.mockImplementation(
      (_topicOptions, _kafkaSettings, onMessageCallback) => {
        mockMessages.forEach(onMessageCallback);
      }
    );

    await conditionalConsumerResolver(
      {},
      {
        topicName: mockTopic,
        conditions: {
          encoding: JSON_ENCODING,
          conditions: [
            [
              {
                value: "to-match",
                objectPath: "value.testPath",
                comparator: EQUAL_TO
              }
            ]
          ]
        }
      },
      { kafkaBrokers: ["broker"] }
    );
    jest.runOnlyPendingTimers();

    expect(mockPublish.mock.calls[0][1]).toEqual({
      conditionalConsumer: {
        matchingMessagesCount: 1,
        rejectedMessagesCount: 2,
        messages: [message1]
      }
    });
  });

  it("Returns the subscriptions async iterator", async () => {
    const mockTopicName = "topic";
    const expected = mockAsyncIteratorReturnValue;
    const actual = await conditionalConsumerResolver(
      {},
      { kafkaBrokers: ["broker"], topicName: mockTopicName }
    );
    expect(actual).toBe(expected);
  });
});
