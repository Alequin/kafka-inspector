const mockConsumerGroups = require("mock-test-data/data/mock-consumer-groups");
const mockDescribeGroups = require("mock-test-data/kafka-node/mock-describe-groups");
jest.mock("server-common/kafka/access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("server-common/kafka/access-global-kafka-connections");

accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp()
);

const consumerGroupResolver = require("./consumer-group-resolver");

describe("consumerGroupResolver", () => {
  const mockContext = { kafkaConnectionConfig: { kafkaBroker: [] } };

  it("Resolves information on a single consumer group", async () => {
    const expected =
      mockDescribeGroups.response[mockConsumerGroups.consumerGroup1];

    const actual = await consumerGroupResolver(
      {},
      { groupName: mockConsumerGroups.consumerGroup1 },
      mockContext
    );

    expect(actual).toEqual(expected);
  });
});
