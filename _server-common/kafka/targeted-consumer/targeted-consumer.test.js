jest.mock("../kafka-connections/kafka-node-consumer");
const kafkaNodeConsumer = require("../kafka-connections/kafka-node-consumer");

const mockOnConsumerMessage = jest.fn();
const mockCloseConsumer = jest.fn();
const mockRemoveTopics = jest.fn();
const mockAddTopics = jest.fn();

const mockConsumer = {
  on: mockOnConsumerMessage,
  removeTopics: mockRemoveTopics.mockImplementation((_topics, callback) => {
    const error = false;
    callback(error);
  }),
  addTopics: mockAddTopics.mockImplementation((_topics, callback) => {
    const error = false;
    callback(error);
  }),
  payloads: [
    {
      partition: 0
    }
  ]
};

kafkaNodeConsumer.mockImplementation(
  (_kafkaConnectionConfig, _options, callback) => {
    return callback(mockConsumer);
  }
);

const targetedConsumer = require("./targeted-consumer");

describe("targetedConsumer", () => {
  beforeEach(() => {
    mockCloseConsumer.mockClear();
    mockRemoveTopics.mockClear();
    mockAddTopics.mockClear();
  });

  it("Passes consumed messages to the given callback", async () => {
    const mockTopicOptions = {
      topicName: "topic1",
      partitionsToConsumerFrom: [0],
      offsetRange: { min: 0, max: 10 }
    };
    const mockKafkaConnectionConfig = { kafkaBrokers: ["broker1"] };

    const mockMessages = [
      { offset: 1, partition: 0 },
      { offset: 5, partition: 0 },
      { offset: 100, partition: 0 }
    ];
    mockOnConsumerMessage.mockImplementation((_eventType, callback) => {
      mockMessages.forEach(callback);
    });

    const callback = message => {
      expect(mockMessages.includes(message)).toBe(true);
    };

    await targetedConsumer(
      mockTopicOptions,
      mockKafkaConnectionConfig,
      callback
    );
  });

  it(`Only calls the given callback as long the message offset 
  is below or equal to the max offset range`, async () => {
    const mockTopicOptions = {
      topicName: "topic1",
      partitionsToConsumerFrom: [0],
      offsetRange: { min: 0, max: 10 }
    };
    const mockKafkaConnectionConfig = { kafkaBrokers: ["broker1"] };

    const mockMessages = [
      { offset: 1, partition: 0 },
      { offset: 5, partition: 0 },
      { offset: 100, partition: 0 }
    ];
    mockOnConsumerMessage.mockImplementation((_eventType, callback) => {
      mockMessages.forEach(callback);
    });

    const callback = jest.fn();

    await targetedConsumer(
      mockTopicOptions,
      mockKafkaConnectionConfig,
      callback
    );

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it(`Changes to the next partition when the max offset has been reached`, async () => {
    const mockTopicOptions = {
      topicName: "topic1",
      partitionsToConsumerFrom: [0, 1],
      offsetRange: { min: 0, max: 10 }
    };
    const mockKafkaConnectionConfig = { kafkaBrokers: ["broker1"] };

    const mockMessages = [
      { offset: 100, partition: 0 },
      { offset: 100, partition: 1 }
    ];
    mockOnConsumerMessage.mockImplementation((_eventType, callback) => {
      mockMessages.forEach(callback);
    });

    const callback = jest.fn();

    await targetedConsumer(
      mockTopicOptions,
      mockKafkaConnectionConfig,
      callback
    );

    expect(mockRemoveTopics).toHaveBeenCalledTimes(1);
    expect(mockAddTopics).toHaveBeenCalledTimes(1);
  });

  it(`Negative min offsets should default to 0`, async () => {
    const mockTopicOptions = {
      topicName: "topic1",
      partitionsToConsumerFrom: [0, 1],
      offsetRange: { min: -999999, max: 10 }
    };
    const mockKafkaConnectionConfig = { kafkaBrokers: ["broker1"] };

    const mockMessages = [
      { offset: 100, partition: 0 },
      { offset: 100, partition: 1 }
    ];
    mockOnConsumerMessage.mockImplementation((_eventType, callback) => {
      mockMessages.forEach(callback);
    });

    const callback = jest.fn();

    await targetedConsumer(
      mockTopicOptions,
      mockKafkaConnectionConfig,
      callback
    );

    const expectedMinOffset = 0;

    // The offset the consumer is instantiated with
    const actualMinOffset1 = kafkaNodeConsumer.mock.calls[0][1].offset;
    expect(actualMinOffset1).toBe(0);

    // The offset new partitions are instructed to start from
    const actualMinOffset2 = mockAddTopics.mock.calls[0][0][0].offset;
    expect(actualMinOffset2).toBe(expectedMinOffset);
  });

  it(`Defaults the requested max offset to the last messages offset if it is to high`, async () => {
    const mockTopicOptions = {
      topicName: "topic1",
      partitionsToConsumerFrom: [0],
      offsetRange: { min: 0, max: 10000 }
    };
    const mockKafkaConnectionConfig = { kafkaBrokers: ["broker1"] };

    const mockMessages = [{ offset: 9, partition: 0 }];
    mockOnConsumerMessage.mockImplementation((_eventType, callback) => {
      mockMessages.forEach(callback);
    });

    const callback = jest.fn();

    await targetedConsumer(
      mockTopicOptions,
      mockKafkaConnectionConfig,
      callback
    );

    // Should pass the consumed message to the callback
    // as it is equal to / less than the maxOffset
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
