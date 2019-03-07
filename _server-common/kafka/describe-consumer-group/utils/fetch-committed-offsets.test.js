jest.mock("../../access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../../access-global-kafka-connections");

const mockFetchOffsets = jest.fn();

accessGlobalKafkaConnections.mockReturnValue({
  kafkaJs: {
    admin: {
      fetchOffsets: mockFetchOffsets
    }
  }
});

const fetchCommittedOffsets = require("./fetch-committed-offsets");

describe("fetchCommittedOffsets", () => {
  it("Should call describeConfigs with requested topic", async () => {
    const topicName = "topic1";
    const consumerGroupName = "group1";
    await fetchCommittedOffsets(topicName, consumerGroupName);

    expect(mockFetchOffsets).toBeCalledWith({
      topic: topicName,
      groupId: consumerGroupName
    });
  });
});
