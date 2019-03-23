const { forEach } = require("lodash");
jest.mock("graphql-subscriptions");
const { PubSub } = require("graphql-subscriptions");

const mockAsyncIterator = jest.fn();
const mockAsyncIteratorReturnValue = {};
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

jest.mock("server-common/kafka/access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");

const latestOffsetConsumerResolver = require("./latest-offset-consumer-resolver");

describe("latestOffsetConsumerResolver", () => {
  jest.useFakeTimers();

  const mockBrokers = ["broker1", "broker2"];
  const mockTopicName = "topic1";
  const expectedSubscriptionKey = `${mockBrokers.join("")}-${mockTopicName}`;

  beforeEach(() => {
    mockPublish.mockClear();
    forEach(mockSubscribedEvents, (_value, key) => {
      delete mockSubscribedEvents[key];
    });
  });

  describe("when there is a matching subscription key exists", () => {
    const mockConsumerGroupConstructor = jest.fn();

    beforeEach(() => {
      accessGlobalKafkaConnections.mockReturnValue(
        mockAccessGlobalKafkaConnectionsImp([
          {
            path: "kafkaNode.consumerGroup",
            override: mockConsumerGroupConstructor
          }
        ])
      );

      mockSubscribedEvents[expectedSubscriptionKey] = null;
    });

    it("does not create a new consumer", () => {
      latestOffsetConsumerResolver(
        {},
        { topicName: mockTopicName, kafkaBrokers: mockBrokers }
      );
      expect(mockConsumerGroupConstructor).toHaveBeenCalledTimes(0);
    });

    it("returns the value given by asyncIterator", () => {
      const expected = mockAsyncIteratorReturnValue;
      const actual = latestOffsetConsumerResolver(
        {},
        { topicName: mockTopicName, kafkaBrokers: mockBrokers }
      );
      expect(mockConsumerGroupConstructor).toHaveBeenCalledTimes(0);
      expect(actual).toBe(expected);
    });
  });

  describe("when there is not a matching subscription key exists", () => {
    const mockConsumerGroup = jest.fn();
    const mockCloseConsumerGroup = jest.fn();

    beforeEach(() => {
      mockConsumerGroup.mockClear();
      mockCloseConsumerGroup.mockClear();
      accessGlobalKafkaConnections.mockReturnValue(
        mockAccessGlobalKafkaConnectionsImp([
          {
            path: "kafkaNode.consumerGroup",
            override: mockConsumerGroup.mockImplementation(() => {
              return {
                on: (_eventType, callback) => {
                  const message = { offset: 1, partition: 0 };
                  callback(message);
                },
                removeTopics: (_topics, callback) => {
                  const error = false;
                  callback(error);
                },
                addTopics: (_topics, callback) => {
                  const error = false;
                  callback(error);
                },
                close: mockCloseConsumerGroup,
                payloads: [
                  {
                    partition: 0
                  }
                ]
              };
            })
          }
        ])
      );
    });

    it("returns the value given by asyncIterator", () => {
      const expected = mockAsyncIteratorReturnValue;
      const actual = latestOffsetConsumerResolver(
        {},
        { topicName: mockTopicName, kafkaBrokers: mockBrokers }
      );

      jest.runOnlyPendingTimers();

      expect(actual).toBe(expected);
    });

    it("creates a new consumer and publishes consumed messages", () => {
      latestOffsetConsumerResolver(
        {},
        { topicName: mockTopicName, kafkaBrokers: mockBrokers }
      );

      jest.runOnlyPendingTimers();

      expect(mockConsumerGroup).toHaveBeenCalledTimes(1);
      expect(mockConsumerGroup.mock.calls[0][0].topicNames).toEqual([
        mockTopicName
      ]);

      expect(mockPublish).toHaveBeenCalledTimes(1);
      expect(mockPublish).toHaveBeenCalledWith(expectedSubscriptionKey, {
        latestOffsetConsumer: [{ offset: 1, partition: 0 }]
      });
    });

    it("closes consumer if user stops listening", () => {
      latestOffsetConsumerResolver(
        {},
        { topicName: mockTopicName, kafkaBrokers: mockBrokers }
      );

      forEach(mockSubscribedEvents, (_value, key) => {
        delete mockSubscribedEvents[key];
      });
      jest.runOnlyPendingTimers();

      expect(mockConsumerGroup).toHaveBeenCalledTimes(1);
      expect(mockConsumerGroup.mock.calls[0][0].topicNames).toEqual([
        mockTopicName
      ]);

      expect(mockCloseConsumerGroup).toHaveBeenCalledTimes(1);
    });
  });
});
