jest.mock("../../access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../../access-global-kafka-connections");

const mockKafkaConnections = mockAccessGlobalKafkaConnectionsImp();
accessGlobalKafkaConnections.mockReturnValue(mockKafkaConnections);

const fetchCommittedOffsets = require("./fetch-committed-offsets");

describe("fetchCommittedOffsets", () => {
  it("Should call describeConfigs with requested topic", async () => {
    const mockFetchOffsets = mockKafkaConnections.kafkaJs.admin.fetchOffsets;

    const topicName = "topic1";
    const consumerGroupName = "group1";
    await fetchCommittedOffsets(topicName, consumerGroupName);

    expect(mockFetchOffsets).toBeCalledWith({
      topic: topicName,
      groupId: consumerGroupName
    });
  });
});
