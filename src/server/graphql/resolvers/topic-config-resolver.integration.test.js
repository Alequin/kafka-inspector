jest.mock("kafka-node");

const topicsConfigResolver = require("./topic-config-resolver");

describe("topicsConfigResolver", () => {
  const mockContext = {
    kafkaConnectionConfig: { kafkaBroker: ["broker:9092"] }
  };

  it("Returns a list of config values", async () => {
    const expected = [
      {
        name: "compression.type",
        value: "producer",
        readOnly: false,
        isDefault: true,
        isSensitive: false
      }
    ];
    const actual = await topicsConfigResolver(
      { name: "topic1" },
      {},
      mockContext
    );
    expect(actual).toEqual(expected);
  });
});
