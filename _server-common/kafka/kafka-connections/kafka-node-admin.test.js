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

  it("Connects to kafka and calls the callback with the admin and client", async () => {
    await kafkaNodeAdmin(mockkafkaConnectionConfig, () => {});

    expect(kafkaNode.KafkaClient).toBeCalledTimes(1);
    expect(kafkaNode.Admin).toBeCalledTimes(1);

    expect(kafkaNode.KafkaClient).toBeCalledWith({
      kafkaHost: "broker1:9092,broker2:9092"
    });
    expect(kafkaNode.Admin).toBeCalledWith(new MockClient());
  });

  it("Provides the admin and client to given callback", done => {
    kafkaNodeAdmin(mockkafkaConnectionConfig, (admin, client) => {
      expect(admin).toEqual(new MockAdmin());
      expect(client).toEqual(new MockClient());
      done();
    });
  });

  it("Returns the result of the callback, resolving any promises", async () => {
    const expected = {};
    const actual = await kafkaNodeAdmin(
      mockkafkaConnectionConfig,
      async () => expected
    );
    expect(actual).toBe(expected);
  });

  it("Closes the kafka client once the function resolves", async () => {
    await kafkaNodeAdmin(mockkafkaConnectionConfig, () => {});
    expect(mockCloseClient).toBeCalledTimes(1);
  });

  it("Closes the Kafka client if the callback throws an error", async () => {
    try {
      kafkaNodeAdmin(mockkafkaConnectionConfig, () => {
        throw new Error();
      });
    } catch {
      expect(mockCloseClient).toHaveBeenCalledTimes(1);
    }
  });

  it("Closes the Kafka client if the callback rejects a promise", async () => {
    await kafkaNodeAdmin(mockkafkaConnectionConfig, async () => {
      throw new Error();
    }).catch(error => {
      expect(isError(error)).toBe(true);
    });
    expect(mockCloseClient).toBeCalledTimes(1);
  });
});
