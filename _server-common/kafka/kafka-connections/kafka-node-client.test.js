jest.mock("kafka-node");
const kafkaNode = require("kafka-node");

const mockCloseClient = jest.fn();
const MockClient = function() {
  this.close = mockCloseClient;
};

kafkaNode.KafkaClient.mockImplementation(MockClient);

const kafkaNodeClient = require("./kafka-node-client");

const mockKafkaConnectionConfig = {
  kafkaBrokers: ["broker1:9092", "broker2:9092"]
};

describe("kafkaNodeClient", () => {
  it("Connects to the kafka client and returns the result", async () => {
    const expected = new MockClient();
    const actual = kafkaNodeClient(mockKafkaConnectionConfig);

    expect(kafkaNode.KafkaClient).toBeCalledTimes(1);
    expect(kafkaNode.KafkaClient).toBeCalledWith({
      kafkaHost: "broker1:9092,broker2:9092"
    });
    expect(actual).toEqual(expected);
  });
});
