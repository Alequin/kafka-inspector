jest.mock("../access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");

const mockKafkaNodeConsumer = jest.fn().mockImplementation(() => {
  return {
    on: (_eventType, callback) => {
      const message = { offset: 1000 };
      callback(message);
    },
    close: () => {}
  };
});

accessGlobalKafkaConnections.mockReturnValue({
  kafkaNode: {
    consumer: mockKafkaNodeConsumer
  }
});

const singleConsumer = require("./single-consumer");

describe("singleConsumer", () => {
  it("If min offset is less than 0 should default to 0", async () => {
    await singleConsumer({
      topicName: "t1",
      partition: 0,
      offsetRange: { min: -1, max: 10 }
    });
    expect(mockKafkaNodeConsumer.mock.calls[0][0][0].offset).toEqual(0);
  });
});
