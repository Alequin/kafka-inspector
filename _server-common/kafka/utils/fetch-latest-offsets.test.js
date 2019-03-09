const mockTopicNames = require("mock-test-data/data/mock-topics");
const {
  response: mockFetchLatestOffsetsResponse
} = require("mock-test-data/kafka-node/mock-fetch-latest-offsets");
jest.mock("../access-global-kafka-connections");
const mockAccessGlobalKafkaConnectionsImp = require("mock-test-data/mock-access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");

const fetchLatestOffsets = require("./fetch-latest-offsets");

describe("fetchLatestOffsets", () => {
  let mockFetchLatestOffsets = null;

  beforeEach(() => {
    const mockKafkaConnections = mockAccessGlobalKafkaConnectionsImp();
    mockFetchLatestOffsets =
      mockKafkaConnections.kafkaNode.offset.fetchLatestOffsets;
    accessGlobalKafkaConnections.mockReturnValue(mockKafkaConnections);
  });

  it.only("Should resolve the topics offsets", async () => {
    const topicName = mockTopicNames.topic1;
    const expected = mockFetchLatestOffsetsResponse[topicName];
    const actual = await fetchLatestOffsets(topicName);
    expect(actual).toEqual(expected);
  });

  it.only("Should call fetchLatestOffsets with given topicName", async () => {
    const topicName = mockTopicNames.topic1;
    await fetchLatestOffsets(topicName);
    expect(mockFetchLatestOffsets.mock.calls[0][0]).toEqual([topicName]);
  });

  it.only("Should reject if there is an error", done => {
    const mockError = "fetch latest offsets error message";

    accessGlobalKafkaConnections.mockReturnValue(
      mockAccessGlobalKafkaConnectionsImp([
        {
          path: "kafkaNode.offset.fetchLatestOffsets",
          override: (_topicNames, callback) => {
            const error = mockError;
            callback(error, null);
          }
        }
      ])
    );

    fetchLatestOffsets("topicName").catch(error => {
      expect(error).toBe(mockError);
      done();
    });
  });
});
