const mockFetchOffsets = require("mock-test-data/kafka-node/mock-fetch-offsets");
const mockFetchCommittedOffsets = require("mock-test-data/kafka-node/mock-fetch-committed-offsets");
jest.mock("../access-kafka-connections");
const accessKafkaConnections = require("../access-kafka-connections");
accessKafkaConnections.mockReturnValue({
  kafkaNode: {
    offset: {
      fetchLatestOffsets: (_topicNames, callback) => {
        const error = false;
        callback(error, mockFetchOffsets.response);
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
      mockFetchOffsets.topicName,
      "mockConsumerGroup"
    );
    expect(actual).toEqual(expected);
  });
});
