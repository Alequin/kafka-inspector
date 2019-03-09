const mockTopics = require("mock-test-data/data/mock-topics");
jest.mock("../access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");

accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp()
);

const checkAgainstLatestOffsetForTopic = require("./check-against-latest-offsets-for-topic");

describe("checkAgainstLatestOffsetForTopic", () => {
  it("Should return the requests max offset when it is below the requested partitions latest offset", async () => {
    const checkMaxOffsetAgainstLatest = checkAgainstLatestOffsetForTopic(
      mockTopics.topic1
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
      mockTopics.topic1
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
