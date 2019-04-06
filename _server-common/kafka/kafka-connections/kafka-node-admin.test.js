const { isError } = require("lodash");
jest.mock("kafka-node");
const kafkaNode = require("kafka-node");

const mockCloseClient = jest.fn();
const MockClient = function() {
  this.close = mockCloseClient;
};
const MockAdmin = function() {
  return "adminId";
};

kafkaNode.KafkaClient.mockImplementation(MockClient);
kafkaNode.Admin.mockImplementation(MockAdmin);
const mockkafkaConnectionConfig = {
  kafkaBrokers: ["broker1:9092", "broker2:9092"]
};

const kafkaNodeAdmin = require("./kafka-node-admin");

describe("kafkaNodeAdmin", () => {
  beforeEach(() => {
    kafkaNode.KafkaClient.mockClear();
    kafkaNode.Admin.mockClear();
    mockCloseClient.mockClear();
  });

  it("Connects to kafka and calls the callback with the offset", async () => {
    await kafkaNodeAdmin(mockkafkaConnectionConfig, (offset, client) => {
      expect(offset).toEqual(new MockAdmin());
    });

    expect(kafkaNode.KafkaClient).toBeCalledTimes(1);
    expect(kafkaNode.Admin).toBeCalledTimes(1);

    expect(kafkaNode.KafkaClient).toBeCalledWith({
      kafkaHost: "broker1:9092,broker2:9092"
    });
    expect(kafkaNode.Admin).toBeCalledWith(new MockClient());
  });
});
