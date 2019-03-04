jest.mock("../access-kafka-connections");
const accessKafkaConnections = require("../access-kafka-connections");

const fetchLatestOffsets = require("./fetch-latest-offsets");

const mockTopicName = "topic1";

describe("fetchLatestOffsets", () => {
  it("Should resolve the topics offsets", async () => {
    const mockOffestsResponse = {};

    accessKafkaConnections.mockReturnValue({
      kafkaNode: {
        offset: {
          fetchLatestOffsets: (_topicNames, callback) => {
            const error = false;
            callback(error, { [mockTopicName]: mockOffestsResponse });
          }
        }
      }
    });
    const expected = mockOffestsResponse;
    const actual = await fetchLatestOffsets(mockTopicName);
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

    fetchLatestOffsets(mockTopicName).catch(error => {
      expect(error).toBe(mockError);
      done();
    });
  });
});
