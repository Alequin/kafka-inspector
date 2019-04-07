const { forEach } = require("lodash");
jest.mock("graphql-subscriptions");
const { PubSub } = require("graphql-subscriptions");

const mockAsyncIterator = jest.fn();
const mockAsyncIteratorReturnValue = Symbol();
const mockPublish = jest.fn();
let mockSubscribedEvents = {};

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

jest.mock("kafka-node");
const kafkaNode = require("kafka-node");
const mockCloseKafkaNodeConsumer = jest.fn();
kafkaNode.ConsumerGroup.mockImplementation(function() {
  this.on = (_event, callback) => {
    const mockMessages = [{ offset: 1 }, { offset: 2 }, { offset: 3 }];
    mockMessages.forEach(callback);
  };
  this.close = mockCloseKafkaNodeConsumer;
});

jest.mock("server-common/kafka/kafka-connections/kafka-node-consumer");
const kafkaNodeConsumerGroup = require("server-common/kafka/kafka-connections/kafka-node-consumer");
kafkaNodeConsumerGroup.mockImplementation(
  jest.requireActual(
    "server-common/kafka/kafka-connections/kafka-node-consumer-group"
  )
);

const latestOffsetConsumerResolver = require("./latest-offset-consumer-resolver");

describe("latestOffsetConsumerResolver", () => {
  jest.useFakeTimers();

  const mockBrokers = ["broker1", "broker2"];
  const mockTopicName = "topic1";
  const expectedSubscriptionKey = `${mockBrokers.join("")}-${mockTopicName}`;

  beforeEach(() => {
    mockPublish.mockClear();
    kafkaNodeConsumerGroup.mockClear();
    mockCloseKafkaNodeConsumer.mockClear();

    // clear all mock subscribed events
    forEach(mockSubscribedEvents, (_value, key) => {
      delete mockSubscribedEvents[key];
    });
  });

  describe("when there is a matching subscription key exists", () => {
    const mockConsumerGroupConstructor = jest.fn();

    beforeEach(() => {
      // Create an existing subscription key
      mockSubscribedEvents[expectedSubscriptionKey] = 0;
    });

    it("does not create a new consumer", () => {
      latestOffsetConsumerResolver(
        {},
        { topicName: mockTopicName, kafkaBrokers: mockBrokers }
      );
      expect(kafkaNodeConsumerGroup).not.toHaveBeenCalled();
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

      expect(kafkaNodeConsumerGroup).toHaveBeenCalledTimes(1);
      expect(
        kafkaNodeConsumerGroup.mock.calls[0][1].topicsToConsumerFrom
      ).toEqual([mockTopicName]);

      expect(mockPublish).toHaveBeenCalledTimes(1);
      expect(mockPublish).toHaveBeenCalledWith(expectedSubscriptionKey, {
        latestOffsetConsumer: [{ offset: 1 }, { offset: 2 }, { offset: 3 }]
      });
    });

    it("closes consumer if user stops listening", () => {
      latestOffsetConsumerResolver(
        {},
        { topicName: mockTopicName, kafkaBrokers: mockBrokers }
      );

      // Clear subscriptions to indicate the use is no longer listening
      forEach(mockSubscribedEvents, (_value, key) => {
        delete mockSubscribedEvents[key];
      });
      jest.runOnlyPendingTimers();

      expect(mockCloseKafkaNodeConsumer).toHaveBeenCalledTimes(1);
    });
  });
});
