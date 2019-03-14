const mockTopics = require("mock-test-data/data/mock-topics");
jest.mock("../access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");
accessGlobalKafkaConnections.mockReturnValue(
  mockAccessGlobalKafkaConnectionsImp()
);

const validMaxOffsets = require("./valid-max-offsets");

describe("validMaxOffsets", () => {
  const mockKafkaConnectionConfig = { kafkaBrokers: ["broker1"] };

  it("Returns the requested max offset when it is less than all partitions latest offsets", async () => {
    const mockRequestedMaxOffset = 2;

    const expected = {
      "0": 2,
      "1": 2,
      "2": 2
    };
    const actual = await validMaxOffsets(
      mockTopics.topic1,
      mockRequestedMaxOffset,
      mockKafkaConnectionConfig
    );
    expect(actual).toEqual(expected);
  });

  it("Returns the latestOffsets minus one when the max offset to greater than all latest offsets", async () => {
    const mockRequestedMaxOffset = Number.MAX_VALUE;

    const expected = {
      "0": 9,
      "1": 19,
      "2": 29
    };
    const actual = await validMaxOffsets(
      mockTopics.topic1,
      mockRequestedMaxOffset,
      mockKafkaConnectionConfig
    );
    expect(actual).toEqual(expected);
  });

  it("Returns the max offset when for partitions with latestOffsets less than the max offset", async () => {
    const mockRequestedMaxOffset = 12;

    const expected = {
      "0": 9,
      "1": 12,
      "2": 12
    };
    const actual = await validMaxOffsets(
      mockTopics.topic1,
      mockRequestedMaxOffset,
      mockKafkaConnectionConfig
    );
    expect(actual).toEqual(expected);
  });
});
