const mockTopicNames = require("mock-test-data/data/mock-topics");
const mockConsumerGroups = require("mock-test-data/data/mock-consumer-groups");
jest.mock("../access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");

const consumerGroupOffsets = require("./consumer-group-offsets");

describe("consumerGroupOffsets", () => {
  it("Should gather and return a summary of offset details from the requested consumer group", async () => {
    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp()
    );

    const expected = {
      sumOfLatestOffsets: 60,
      sumOfCommittedOffsets: 27,
      sumOfLag: 33,
      partitions: [
        { partitionNumber: 0, latestOffset: 10, committedOffset: 4, lag: 6 },
        { partitionNumber: 1, latestOffset: 20, committedOffset: 9, lag: 11 },
        { partitionNumber: 2, latestOffset: 30, committedOffset: 14, lag: 16 }
      ]
    };
    const actual = await consumerGroupOffsets(
      mockTopicNames.topic1,
      mockConsumerGroups.consumerGroup1
    );
    expect(actual).toEqual(expected);
  });
});
