const mockFetchOffsets = require("mock-test-data/kafka-node/mock-fetch-offsets");
jest.mock("../access-kafka-connections");
const accessKafkaConnections = require("../access-kafka-connections");

const mockFetchLatestOffsetsImplementation = jest.fn();
accessKafkaConnections.mockReturnValue({
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
        callback(error, mockFetchOffsets.response);
      }
    );
  });

  it("Should resolve the topics offsets", async () => {
    const { topicName } = mockFetchOffsets;
    const expected = mockFetchOffsets.response[topicName];
    const actual = await fetchLatestOffsets(topicName);
    expect(actual).toEqual(expected);
  });

  it("Should call fetchLatestOffsets with given topicName", async () => {
    const { topicName } = mockFetchOffsets;
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
        callback(error, mockFetchOffsets.response);
      }
    );
    fetchLatestOffsets("topicName").catch(error => {
      expect(error).toBe(mockError);
      done();
    });
  });
});
