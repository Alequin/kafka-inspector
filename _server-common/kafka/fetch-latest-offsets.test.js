jest.mock("./kafka-connections/kafka-node-offset");
const kafkaNodeOffset = require("./kafka-connections/kafka-node-offset");
const mockOffset = {
  fetchLatestOffsets: jest.fn()
};
kafkaNodeOffset.mockImplementation((_kafkaConnectionConfig, callback) => {
  return callback(mockOffset);
});

const fetchLatestOffsets = require("./fetch-latest-offsets");

describe("fetchLatestOffsets", () => {
  const mockOffests = {
    "0": 10,
    "1": 20,
    "2": 30
  };

  beforeEach(() => {
    kafkaNodeOffset.mockClear();
    mockOffset.fetchLatestOffsets.mockImplementation(
      (_topicNames, callback) => {
        const error = false;
        const offsetDetails = {
          topic1: mockOffests
        };
        callback(error, offsetDetails);
      }
    );
  });

  it("Should resolve the requested topics offsets", async () => {
    const topicName = "topic1";
    const expected = mockOffests;
    const actual = await fetchLatestOffsets(topicName, {
      kafkaBrokers: ["broker1:9092"]
    });
    expect(actual).toEqual(expected);
  });

  it("Should call fetchLatestOffsets with given topicName", async () => {
    const topicName = "topic1";
    await fetchLatestOffsets(topicName);
    expect(mockOffset.fetchLatestOffsets.mock.calls[0][0]).toEqual([topicName]);
  });

  it("Should reject if there is an error", done => {
    const mockError = new Error("fetch offsets error");
    mockOffset.fetchLatestOffsets.mockImplementation(
      (_topicNames, callback) => {
        callback(mockError, null);
      }
    );

    fetchLatestOffsets("topicName").catch(error => {
      expect(error).toBe(mockError);
      done();
    });
  });

  it("Should call kafkaNodeOffset", async () => {
    await fetchLatestOffsets("topicName");
    expect(kafkaNodeOffset).toHaveBeenCalledTimes(1);
  });
});
