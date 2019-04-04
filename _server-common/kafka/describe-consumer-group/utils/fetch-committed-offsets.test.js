jest.mock("../../access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../../access-global-kafka-connections");

const mockKafkaConnections = mockAccessGlobalKafkaConnectionsImp();
accessGlobalKafkaConnections.mockReturnValue(mockKafkaConnections);

const fetchCommittedOffsets = require("./fetch-committed-offsets");

describe.skip("fetchCommittedOffsets", () => {
  const mockFetchOffsets = mockKafkaConnections.kafkaJs.admin.fetchOffsets;
  beforeEach(() => {
    mockFetchOffsets.mockClear();
  });

  it("Should call describeConfigs with requested topic", async () => {
    const topicName = "topic1";
    const consumerGroupName = "group1";
    await fetchCommittedOffsets(topicName, consumerGroupName);

    expect(mockFetchOffsets).toBeCalledWith({
      topic: topicName,
      groupId: consumerGroupName
    });
  });

  it("Parses the offsets from strings to integers", async () => {
    const topicName = "topic1";
    const consumerGroupName = "group1";
    await fetchCommittedOffsets(topicName, consumerGroupName);

    expect(mockFetchOffsets).toBeCalledWith({
      topic: topicName,
      groupId: consumerGroupName
    });
  });
});
