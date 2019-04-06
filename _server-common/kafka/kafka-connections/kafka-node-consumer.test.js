jest.mock("kafka-node");
const kafkaNode = require("kafka-node");

const mockCloseClient = jest.fn();
const MockClient = function() {
  this.close = mockCloseClient;
};
const MockConsumer = function() {
  return "consumerId";
};

kafkaNode.KafkaClient.mockImplementation(MockClient);
kafkaNode.Consumer.mockImplementation(MockConsumer);
const mockKafkaConnectionConfig = {
  kafkaBrokers: ["broker1:9092", "broker2:9092"]
};

const kafkaNodeConsumer = require("./kafka-node-consumer");

describe("kafkaNodeConsumer", () => {
  beforeEach(() => {
    kafkaNode.KafkaClient.mockClear();
    kafkaNode.Admin.mockClear();
    mockCloseClient.mockClear();
  });

  it("Connects to kafka and calls the callback with the a preparedConsumer", async () => {
    const consumerOptions = {
      topicsToConsumerFrom: ["topic1"],
      otherOptions: {}
    };
    await kafkaNodeConsumer(
      mockKafkaConnectionConfig,
      consumerOptions,
      consumer => {
        expect(consumer).toEqual(new MockConsumer());
      }
    );

    expect(kafkaNode.KafkaClient).toBeCalledTimes(1);
    expect(kafkaNode.Consumer).toBeCalledTimes(1);

    expect(kafkaNode.KafkaClient).toBeCalledWith({
      kafkaHost: "broker1:9092,broker2:9092"
    });
    expect(kafkaNode.Consumer).toBeCalledWith(
      new MockClient(),
      consumerOptions.topicsToConsumerFrom,
      { ...consumerOptions }
    );
  });
});
