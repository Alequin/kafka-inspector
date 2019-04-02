const mockDescribeGroups = require("mock-test-data/kafka-node/mock-describe-groups");
jest.mock("server-common/kafka/access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");

accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp()
);

const consumerGroupsResolver = require("./consumer-groups-resolver");

describe("consumerGroupsResolver", () => {
  const mockContext = { kafkaConnectionConfig: { kafkaBroker: [] } };

  it("Resolves information on all consumer groups", async () => {
    const expected = Object.values(mockDescribeGroups.response);
    const actual = await consumerGroupsResolver({}, {}, mockContext);
    expect(actual).toEqual(expected);
  });
});
