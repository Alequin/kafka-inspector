const mockFetchLatestOffsets = require("mock-test-data/kafka-node/mock-fetch-latest-offsets");
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
  }
});

const checkAgainstLatestOffsetForTopic = require("./check-against-latest-offsets-for-topic");

describe("checkAgainstLatestOffsetForTopic", () => {
  it("Should return the requests max offset when it is below the requested partitions latest offset", async () => {
    const checkMaxOffsetAgainstLatest = checkAgainstLatestOffsetForTopic(
      mockFetchLatestOffsets.topicName
    );

    const expected = 1;

    const requestedMaxOffset = 1;
    const partition = 0;
    const actual = await checkMaxOffsetAgainstLatest(
      requestedMaxOffset,
      partition
    );

    expect(actual).toBe(expected);
  });

  it("Should return the latest offset when the requested max offset is greater than the requested partitions latest offset", async () => {
    const checkMaxOffsetAgainstLatest = checkAgainstLatestOffsetForTopic(
      mockFetchLatestOffsets.topicName
    );

    const expected = 10;

    const requestedMaxOffset = 9999;
    const partition = 0;
    const actual = await checkMaxOffsetAgainstLatest(
      requestedMaxOffset,
      partition
    );

    expect(actual).toBe(expected);
  });
});
