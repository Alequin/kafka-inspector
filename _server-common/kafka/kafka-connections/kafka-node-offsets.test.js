const { isError } = require("lodash");
jest.mock("kafka-node");
const kafkaNode = require("kafka-node");

const mockCloseClient = jest.fn();
const MockClient = function() {
  this.close = mockCloseClient;
};
const MockOffset = function() {
  return "offsetId";
};

kafkaNode.KafkaClient.mockImplementation(MockClient);
kafkaNode.Offset.mockImplementation(MockOffset);
const mockKafkaConnectionConfig = {
  kafkaBrokers: ["broker1:9092", "broker2:9092"]
};

const kafkaNodeOffset = require("./kafka-node-offset");

describe("kafkaNodeOffset", () => {
  beforeEach(() => {
    kafkaNode.KafkaClient.mockClear();
    kafkaNode.Offset.mockClear();
    mockCloseClient.mockClear();
  });

  it("Connects to kafka and calls the callback with the offset", async () => {
    await kafkaNodeOffset(mockKafkaConnectionConfig, (offset, client) => {
      expect(offset).toEqual(new MockOffset());
    });

    expect(kafkaNode.KafkaClient).toBeCalledTimes(1);
    expect(kafkaNode.Offset).toBeCalledTimes(1);

    expect(kafkaNode.KafkaClient).toBeCalledWith({
      kafkaHost: "broker1:9092,broker2:9092"
    });
    expect(kafkaNode.Offset).toBeCalledWith(new MockClient());
  });
});
