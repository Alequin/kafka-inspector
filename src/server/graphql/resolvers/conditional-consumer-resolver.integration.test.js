const mockTopics = require("mock-test-data/data/mock-topics");
jest.mock("server-common/kafka/access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");
accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp([
    { path: "kafkaJs.admin.getTopicMetadata", override: () => {} }
  ])
);

const { EQUAL_TO } = require("../constants/comparator-options");
const { JSON_ENCODING } = require("../constants/parsing-options");

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

const conditionalConsumerResolver = require("./conditional-consumer-resolver");

describe("conditionalConsumerResolver", () => {
  jest.useFakeTimers();
  const mockPartitions = [0];
  const mockMinOffset = 0;
  const mockMaxOffset = 100;

  it("Publishes the consumed messages", async done => {
    const mockMessages = [
      { partition: 0, offset: 1, value: JSON.stringify({ a: 1 }) },
      { partition: 0, offset: 2, value: JSON.stringify({ a: 1 }) },
      { partition: 0, offset: 3, value: JSON.stringify({ a: 1 }) }
    ];

    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp([
        {
          path: "kafkaNode.consumer",
          override: () => {
            return {
              on: (_eventName, callback) => {
                mockMessages.forEach(callback);
              },
              removeTopics: (_topics, callback) => {
                const error = false;
                callback(error);
              },
              addTopics: (_topics, callback) => {
                const error = false;
                callback(error);
              },
              close: () => {},
              payloads: [
                {
                  partition: 0
                }
              ]
            };
          }
        }
      ])
    );

    await conditionalConsumerResolver(
      {},
      {
        topicName: mockTopics.topic1,
        partitions: mockPartitions,
        minOffset: mockMinOffset,
        maxOffset: mockMaxOffset,
        conditions: {
          encoding: JSON_ENCODING,
          conditions: [
            [{ value: "0", objectPath: "partition", comparator: EQUAL_TO }]
          ]
        }
      },
      { kafkaBrokers: ["broker"] }
    );

    setImmediate(() => {
      jest.runOnlyPendingTimers();
      expect(mockPublish.mock.calls[0][1]).toEqual({
        conditionalConsumer: {
          matchingMessagesCount: 3,
          rejectedMessagesCount: 0,
          messages: mockMessages
        }
      });
      done();
    });
  });
});
