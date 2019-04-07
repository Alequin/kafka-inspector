jest.mock("kafka-node");
const kafkaNode = require("kafka-node");

const mockCloseClient = jest.fn();
const MockClient = function() {
  this.options = { option: 1 };
  this.close = mockCloseClient;
};
const mockCloseConsumer = jest.fn();
const MockConsumerGroup = function() {
  this.close = mockCloseConsumer;
};

kafkaNode.KafkaClient.mockImplementation(MockClient);
kafkaNode.ConsumerGroup.mockImplementation(MockConsumerGroup);
const mockKafkaConnectionConfig = {
  kafkaBrokers: ["broker1:9092", "broker2:9092"]
};

const kafkaNodeConsumerGroup = require("./kafka-node-consumer-group");

describe("kafkaNodeConsumerGroup", () => {
  const consumerOptions = {
    topicsToConsumeFrom: ["topic1"],
    otherOptions: {}
  };

  beforeEach(() => {
    kafkaNode.KafkaClient.mockClear();
    kafkaNode.Admin.mockClear();
    mockCloseClient.mockClear();
    mockCloseConsumer.mockClear();
  });

  it("Connects to kafka and calls the callback with the a preparedConsumer", async () => {
    await kafkaNodeConsumerGroup(
      mockKafkaConnectionConfig,
      consumerOptions,
      consumer => {
        expect(consumer).toEqual(new MockConsumerGroup());
      }
    );

    expect(kafkaNode.KafkaClient).toBeCalledTimes(1);
    expect(kafkaNode.ConsumerGroup).toBeCalledTimes(1);

    expect(kafkaNode.KafkaClient).toBeCalledWith({
      kafkaHost: "broker1:9092,broker2:9092"
    });
    expect(kafkaNode.ConsumerGroup).toBeCalledWith(
      {
        ...new MockClient().options,
        ...consumerOptions
      },
      consumerOptions.topicsToConsumeFrom
    );
  });

  it("Calls the correct close function when finished", async () => {
    await kafkaNodeConsumerGroup(
      mockKafkaConnectionConfig,
      consumerOptions,
      (mockKafkaConnectionConfig, () => {})
    );
    expect(mockCloseConsumer).toHaveBeenCalledTimes(1);
    expect(mockCloseClient).toHaveBeenCalledTimes(1);
  });
});
