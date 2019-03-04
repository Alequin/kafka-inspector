const mockFetchOffsets = require("mock-test-data/kafka-node/mock-fetch-offsets");
jest.mock("../access-kafka-connections");
const accessKafkaConnections = require("../access-kafka-connections");

const fetchLatestOffsets = require("./fetch-latest-offsets");

describe("fetchLatestOffsets", () => {
  it("Should resolve the topics offsets", async () => {
    accessKafkaConnections.mockReturnValue({
      kafkaNode: {
        offset: {
          fetchLatestOffsets: (_topicNames, callback) => {
            const error = false;
            callback(error, mockFetchOffsets.response);
          }
        }
      }
    });
    const { topicName } = mockFetchOffsets;
    const expected = mockFetchOffsets.response[topicName];
    const actual = await fetchLatestOffsets(topicName);
    expect(actual).toEqual(expected);
  });

  it("Should reject if there is an error", done => {
    const mockError = "fetch latest offsets error message";
    accessKafkaConnections.mockReturnValue({
      kafkaNode: {
        offset: {
          fetchLatestOffsets: (_topicNames, callback) => {
            const error = mockError;
            callback(error, null);
          }
        }
      }
    });

    fetchLatestOffsets("topicName").catch(error => {
      expect(error).toBe(mockError);
      done();
    });
  });
});
