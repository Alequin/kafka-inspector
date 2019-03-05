const mockFetchLatestOffsets = require("mock-test-data/kafka-node/mock-fetch-latest-offsets");
const mockFetchCommittedOffsets = require("mock-test-data/kafka-node/mock-fetch-committed-offsets");
jest.mock("../access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");
accessGlobalKafkaConnections.mockReturnValue({
  kafkaNode: {
    offset: {
      fetchLatestOffsets: (_topicNames, callback) => {
        const error = false;
        callback(error, mockFetchLatestOffsets.response);
      }
    }
  },
  kafkaJs: {
    admin: {
      fetchOffsets: async (_topicName, _consumerGroupName) => {
        return mockFetchCommittedOffsets.response;
      }
    }
  }
});

const consumerGroupOffsets = require("./consumer-group-offsets");

describe("consumerGroupOffsets", async () => {
  it("Should gather and return a summary of offset details from the requested consumer group", async () => {
    const expected = {
      sumOfLatestOffsets: 60,
      sumOfLag: 33,
      partitions: [
        { partition: 0, latestOffset: 10, lag: 6 },
        { partition: 1, latestOffset: 20, lag: 11 },
        { partition: 2, latestOffset: 30, lag: 16 }
      ]
    };
    const actual = await consumerGroupOffsets(
      mockFetchLatestOffsets.topicName,
      "mockConsumerGroup"
    );
    expect(actual).toEqual(expected);
  });
});
