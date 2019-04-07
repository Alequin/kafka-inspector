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

jest.mock("kafka-node");
const kafkaNode = require("kafka-node");
const mockCloseKafkaNodeConsumer = jest.fn();
const mockMessages = [
  { partition: 0, offset: 1, value: JSON.stringify({ a: 1 }) },
  { partition: 0, offset: 2, value: JSON.stringify({ a: 1 }) },
  { partition: 0, offset: 3, value: JSON.stringify({ a: 1 }) }
];
kafkaNode.Consumer.mockImplementation(function() {
  this.on = (_event, callback) => {
    mockMessages.forEach(callback);
  };
  this.close = mockCloseKafkaNodeConsumer;
  this.payloads = [
    {
      partition: 0
    }
  ];
});

const conditionalConsumerResolver = require("./conditional-consumer-resolver");

describe("conditionalConsumerResolver", () => {
  jest.useFakeTimers();
  const mockPartitions = [0];
  const mockMinOffset = 0;
  const mockMaxOffset = 100;

  it("Publishes the consumed messages", async done => {
    await conditionalConsumerResolver(
      {},
      {
        kafkaBrokers: ["broker:9092"],
        topicName: "topic1",
        partitions: mockPartitions,
        minOffset: mockMinOffset,
        maxOffset: mockMaxOffset,
        conditions: {
          encoding: JSON_ENCODING,
          conditions: [
            [{ value: "0", objectPath: "partition", comparator: EQUAL_TO }]
          ]
        }
      }
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
