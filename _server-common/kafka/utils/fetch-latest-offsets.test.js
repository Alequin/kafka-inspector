const mockFetchLatestOffsets = require("mock-test-data/kafka-node/mock-fetch-latest-offsets");
jest.mock("../access-global-kafka-connections");
const accessGlobalKafkaConnections = require("../access-global-kafka-connections");

const mockFetchLatestOffsetsImplementation = jest.fn();
accessGlobalKafkaConnections.mockReturnValue({
  kafkaNode: {
    offset: {
      fetchLatestOffsets: mockFetchLatestOffsetsImplementation
    }
  }
});

const fetchLatestOffsets = require("./fetch-latest-offsets");

describe("fetchLatestOffsets", () => {
  beforeEach(() => {
    mockFetchLatestOffsetsImplementation.mockImplementation(
      (_topicNames, callback) => {
        const error = false;
        callback(error, mockFetchLatestOffsets.response);
      }
    );
  });

  it("Should resolve the topics offsets", async () => {
    const { topicName } = mockFetchLatestOffsets;
    const expected = mockFetchLatestOffsets.response[topicName];
    const actual = await fetchLatestOffsets(topicName);
    expect(actual).toEqual(expected);
  });

  it("Should call fetchLatestOffsets with given topicName", async () => {
    const { topicName } = mockFetchLatestOffsets;
    await fetchLatestOffsets(topicName);
    expect(mockFetchLatestOffsetsImplementation.mock.calls[0][0]).toEqual([
      topicName
    ]);
  });

  it("Should reject if there is an error", done => {
    const mockError = "fetch latest offsets error message";
    mockFetchLatestOffsetsImplementation.mockImplementation(
      (_topicNames, callback) => {
        const error = mockError;
        callback(error, mockFetchLatestOffsets.response);
      }
    );
    fetchLatestOffsets("topicName").catch(error => {
      expect(error).toBe(mockError);
      done();
    });
  });
});
