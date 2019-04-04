jest.mock("kafka-node");
const kafkaNode = require("kafka-node");
const MockClient = function() {
  return "clientId";
};
const MockAdmin = function() {
  return "adminId";
};

kafkaNode.KafkaClient.mockImplementation(MockClient);
kafkaNode.Admin.mockImplementation(MockAdmin);

const kafkaNodeAdmin = require("./kafka-node-admin");

describe("kafkaNodeAdmin", () => {
  it("Connects to kafka and returns the adminClient", () => {
    const actual = kafkaNodeAdmin({
      kafkaBrokers: ["broker1:9092", "broker2:9092"]
    });

    expect(kafkaNode.KafkaClient).toBeCalledTimes(1);
    expect(kafkaNode.Admin).toBeCalledTimes(1);

    expect(kafkaNode.KafkaClient).toBeCalledWith({
      kafkaHost: "broker1:9092,broker2:9092"
    });
    expect(kafkaNode.Admin).toBeCalledWith(new MockClient());
    expect(actual).toEqual(new MockAdmin());
  });
});
