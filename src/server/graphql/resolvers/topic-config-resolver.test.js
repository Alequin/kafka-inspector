const mockTopics = require("mock-test-data//data/mock-topics");
jest.mock("server-common/kafka/access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");

accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp()
);

const topicsConfigResolver = require("./topic-config-resolver");

describe("topicsConfigResolver", () => {
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
    const actual = await topicsConfigResolver(mockTopics.topic1);
    expect(actual).toEqual(expected);
  });
});
