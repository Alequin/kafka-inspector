const mockTopics = require("mock-test-data/data/mock-topics");
jest.mock("../access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");

const mockConsumerFunc = jest.fn();
const mockOnConsumerMessage = jest.fn();
const mockCloseConsumer = jest.fn();
const mockRemoveTopics = jest.fn();
const mockAddTopics = jest.fn();

accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp([
    {
      path: "kafkaNode.consumer",
      override: mockConsumerFunc.mockImplementation(() => {
        return {
          on: mockOnConsumerMessage,
          removeTopics: mockRemoveTopics.mockImplementation(
            (_topics, callback) => {
              const error = false;
              callback(error);
            }
          ),
          addTopics: mockAddTopics.mockImplementation((_topics, callback) => {
            const error = false;
            callback(error);
          }),
          close: mockCloseConsumer,
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

const paginationConsumer = require("./pagination-consumer");

describe("paginationConsumer", () => {
  beforeEach(() => {
    mockCloseConsumer.mockReset();
    mockRemoveTopics.mockReset();
    mockAddTopics.mockReset();
    mockConsumerFunc.mockClear();
  });

  it("Passes consumed messages to the given callback", async () => {
    const mockTopicOptions = {
      topicName: mockTopics.topic1,
      partitions: [0],
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

    await paginationConsumer(
      mockTopicOptions,
      mockKafkaConnectionConfig,
      callback
    );
  });

  it(`Only calls the given callback as long a the message offset 
  in below or equal to the max offset range`, async () => {
    const mockTopicOptions = {
      topicName: mockTopics.topic1,
      partitions: [0],
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

    await paginationConsumer(
      mockTopicOptions,
      mockKafkaConnectionConfig,
      callback
    );

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it(`Closes the consumer when done`, async () => {
    const mockTopicOptions = {
      topicName: mockTopics.topic1,
      partitions: [0],
      offsetRange: { min: 0, max: 10 }
    };
    const mockKafkaConnectionConfig = { kafkaBrokers: ["broker1"] };
    const callback = jest.fn();

    await paginationConsumer(
      mockTopicOptions,
      mockKafkaConnectionConfig,
      callback
    );

    expect(mockCloseConsumer).toHaveBeenCalledTimes(1);
  });

  it(`Changes to the next topic when the max offset has been reached`, async () => {
    const mockTopicOptions = {
      topicName: mockTopics.topic1,
      partitions: [0, 1],
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

    await paginationConsumer(
      mockTopicOptions,
      mockKafkaConnectionConfig,
      callback
    );

    expect(mockRemoveTopics).toHaveBeenCalledTimes(1);
    expect(mockAddTopics).toHaveBeenCalledTimes(1);
  });

  it(`Negative min offsets should default to 0`, async () => {
    const mockTopicOptions = {
      topicName: mockTopics.topic1,
      partitions: [0, 1],
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

    await paginationConsumer(
      mockTopicOptions,
      mockKafkaConnectionConfig,
      callback
    );

    const expectedMinOffset = 0;

    // The offset the consumer is instantiated with
    const actualMinOffset1 = mockConsumerFunc.mock.calls[0][0][0].offset;
    expect(actualMinOffset1).toBe(expectedMinOffset);

    // The offset new partitions are instructed to start from
    const actualMinOffset2 = mockAddTopics.mock.calls[0][0][0].offset;
    expect(actualMinOffset2).toBe(expectedMinOffset);
  });

  it(`Defaults the requested max offset to the last messages offset if it is to high`, async () => {
    const mockTopicOptions = {
      topicName: mockTopics.topic1,
      partitions: [0],
      offsetRange: { min: 0, max: 10000 }
    };
    const mockKafkaConnectionConfig = { kafkaBrokers: ["broker1"] };

    const mockMessages = [{ offset: 9, partition: 0 }];
    mockOnConsumerMessage.mockImplementation((_eventType, callback) => {
      mockMessages.forEach(callback);
    });

    const callback = jest.fn();

    await paginationConsumer(
      mockTopicOptions,
      mockKafkaConnectionConfig,
      callback
    );

    // Should pass the consumed message to the callback
    // as it is equal to / less than the maxOffset
    expect(callback).toHaveBeenCalledTimes(1);
    // Close is called as the max offset has been set to 9, the last message
    expect(mockCloseConsumer).toHaveBeenCalled();
  });
});
