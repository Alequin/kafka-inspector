jest.mock("kafka-node");
const brokersResolver = require("./brokers-resolver");

describe("brokersResolver", () => {
  it("Makes a request for the broker list and returns the response unmodified", async () => {
    const mockKafkaConnectionConfig = { kafkaBrokers: ["broker:9092"] };
    const mockContext = { kafkaConnectionConfig: mockKafkaConnectionConfig };

    const expected = [
      { host: "broker1", port: 9092, id: 1, isController: false },
      { host: "broker2", port: 9092, id: 2, isController: true },
      { host: "broker3", port: 9092, id: 3, isController: false }
    ];

    const actual = await brokersResolver({}, {}, mockContext);
    expect(actual).toEqual(expected);
  });
});
