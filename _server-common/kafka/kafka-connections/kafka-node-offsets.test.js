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
const mockKafkaConfigSettings = {
  kafkaBrokers: ["broker1:9092", "broker2:9092"]
};

const kafkaNodeOffset = require("./kafka-node-offset");

describe.skip("kafkaNodeOffset", () => {
  beforeEach(() => {
    kafkaNode.KafkaClient.mockClear();
    kafkaNode.Offset.mockClear();
    mockCloseClient.mockClear();
  });

  it("Connects to kafka and calls the callback with the offset and client", async () => {
    await kafkaNodeOffset(mockKafkaConfigSettings, () => {});

    expect(kafkaNode.KafkaClient).toBeCalledTimes(1);
    expect(kafkaNode.Offset).toBeCalledTimes(1);

    expect(kafkaNode.KafkaClient).toBeCalledWith({
      kafkaHost: "broker1:9092,broker2:9092"
    });
    expect(kafkaNode.Offset).toBeCalledWith(new MockClient());
  });

  it("Provides the offset and client to given callback", done => {
    kafkaNodeOffset(mockKafkaConfigSettings, (offset, client) => {
      expect(offset).toEqual(new MockOffset());
      expect(client).toEqual(new MockClient());
      done();
    });
  });

  it("Returns the result of the callback, resolving any promises", async () => {
    const expected = {};
    const actual = await kafkaNodeOffset(
      mockKafkaConfigSettings,
      async () => expected
    );
    expect(actual).toBe(expected);
  });

  it("Closes the kafka client once the function resolves", async () => {
    await kafkaNodeOffset(mockKafkaConfigSettings, () => {});
    expect(mockCloseClient).toBeCalledTimes(1);
  });

  it("Closes the Kafka client if the callback throws an error", async () => {
    try {
      kafkaNodeOffset(mockKafkaConfigSettings, () => {
        throw new Error();
      });
    } catch {
      expect(mockCloseClient).toHaveBeenCalledTimes(1);
    }
  });

  it("Closes the Kafka client if the callback rejects a promise", async () => {
    await kafkaNodeOffset(mockKafkaConfigSettings, async () => {
      throw new Error();
    }).catch(error => {
      expect(isError(error)).toBe(true);
    });
    expect(mockCloseClient).toBeCalledTimes(1);
  });
});
