jest.mock("../access-kafka-connections");
const accessKafkaConnections = require("../access-kafka-connections");

const mockFetchOffsets = jest.fn();

accessKafkaConnections.mockReturnValue({
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
