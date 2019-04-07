jest.mock("../../kafka-connections/kafka-js-admin");
const kafkaJsAdmin = require("../../kafka-connections/kafka-js-admin");

const mockFetchOffsets = jest.fn();
const mockAdmin = {
  fetchOffsets: mockFetchOffsets
};
kafkaJsAdmin.mockImplementation((_kafkaConnectionConfig, callback) => {
  return callback(mockAdmin);
});

const mockKafkaConnectionConfig = { kafkaBrokers: ["broker1:9092"] };
const fetchCommittedOffsets = require("./fetch-committed-offsets");

describe("fetchCommittedOffsets", () => {
  beforeEach(() => {});
  it("Requests the offsets and parses them to integers", async () => {
    mockFetchOffsets.mockResolvedValue([
      { partition: 0, offset: "5" },
      { partition: 0, offset: "10" },
      { partition: 0, offset: "15" }
    ]);

    const topicName = "topic1";
    const consumerGroupName = "group1";

    const expected = [
      { partition: 0, committedOffset: 5 },
      { partition: 0, committedOffset: 10 },
      { partition: 0, committedOffset: 15 }
    ];
    const actual = await fetchCommittedOffsets(
      topicName,
      consumerGroupName,
      mockKafkaConnectionConfig
    );

    expect(actual).toEqual(expected);
  });
});
