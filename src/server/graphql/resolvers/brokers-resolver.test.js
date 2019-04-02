jest.mock("server-common/kafka/access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");
accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp()
);

const brokersResolver = require("./brokers-resolver");

describe("brokersResolver", () => {
  it("Makes a request for the broker list and returns the response unmodified", async () => {
    const mockKafkaConnectionConfig = { kafkaBrokers: ["broker"] };
    const mockContext = { kafkaConnectionConfig: mockKafkaConnectionConfig };

    const expected = [
      { nodeId: 1, host: "broker1", port: 9092, id: 1, isController: false },
      { nodeId: 2, host: "broker2", port: 9092, id: 2, isController: true },
      { nodeId: 3, host: "broker3", port: 9092, id: 3, isController: false }
    ];

    const actual = await brokersResolver({}, {}, mockContext);
    expect(actual).toEqual(expected);
  });
});
