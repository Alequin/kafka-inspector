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
const mockKafkaConfigSettings = {
  kafkaBrokers: ["broker1:9092", "broker2:9092"]
};

const kafkaNodeAdmin = require("./kafka-node-admin");

describe("kafkaNodeAdmin", () => {
  beforeEach(() => {
    kafkaNode.KafkaClient.mockClear();
    kafkaNode.Admin.mockClear();
    mockCloseClient.mockClear();
  });

  it("Connects to kafka and calls the callback with the admin and client", async () => {
    await kafkaNodeAdmin(mockKafkaConfigSettings, () => {});

    expect(kafkaNode.KafkaClient).toBeCalledTimes(1);
    expect(kafkaNode.Admin).toBeCalledTimes(1);

    expect(kafkaNode.KafkaClient).toBeCalledWith({
      kafkaHost: "broker1:9092,broker2:9092"
    });
    expect(kafkaNode.Admin).toBeCalledWith(new MockClient());
  });

  it("Provides the admin and client to given callback", done => {
    kafkaNodeAdmin(mockKafkaConfigSettings, (admin, client) => {
      expect(admin).toEqual(new MockAdmin());
      expect(client).toEqual(new MockClient());
      done();
    });
  });

  it("Closes the kafka client once the function resolves", async () => {
    await kafkaNodeAdmin(mockKafkaConfigSettings, () => {});
    expect(mockCloseClient).toBeCalledTimes(1);
  });

  it("Throws an error if at least one of the broker formats is wrong", () => {
    expect(() =>
      kafkaNodeAdmin({
        kafkaBrokers: ["broker1:9092", "broker2"]
      })
    ).toThrow();
  });

  it("Closes the Kafka client if the callback throws an error", async () => {
    await kafkaNodeAdmin(mockKafkaConfigSettings, () => {
      throw new Error();
    }).catch(error => {
      expect(isError(error)).toBe(true);
    });
    expect(mockCloseClient).toBeCalledTimes(1);
  });
});
