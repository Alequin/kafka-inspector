jest.mock("./kafka-connections/kafka-js-admin");
const kafkaJsAdmin = require("./kafka-connections/kafka-js-admin");

const mockGetTopicMetadata = jest.fn();
const mockAdmin = {
  getTopicMetadata: mockGetTopicMetadata
};
kafkaJsAdmin.mockImplementation((_kafkaConnectionConfig, callback) => {
  return callback(mockAdmin);
});

const topic = require("./topic");

describe("topic", () => {
  it("Return details on the requested topic, sorting the partition and number", async () => {
    mockGetTopicMetadata.mockReturnValue({
      topics: [
        {
          topics: "topic1",
          partitions: [
            {
              partitionId: 1,
              partitionErrorCode: 0,
              leader: 1,
              replicas: [3, 1, 2],
              isr: [1, 3, 2]
            },
            {
              partitionId: 0,
              partitionErrorCode: 0,
              leader: 1,
              replicas: [3, 1, 2],
              isr: [1, 3, 2]
            }
          ]
        }
      ]
    });

    const expected = {
      name: "topic1",
      partitions: [
        {
          topic: "topic1",
          partition: 0,
          leader: 1,
          replicas: [3, 1, 2],
          isr: [1, 3, 2],
          error: null
        },
        {
          topic: "topic1",
          partition: 1,
          leader: 1,
          replicas: [3, 1, 2],
          isr: [1, 3, 2],
          error: null
        }
      ]
    };

    const actual = await topic("topic1", { kafkaBrokers: ["broker1:9092"] });
    expect(actual).toEqual(expected);
  });

  it("Identifies the error if a partition has one", async () => {
    mockGetTopicMetadata.mockReturnValue({
      topics: [
        {
          topics: "topic1",
          partitions: [
            {
              partitionId: 0,
              partitionErrorCode: 0,
              leader: 1,
              replicas: [3, 1, 2],
              isr: [1, 3, 2],
              partitionErrorCode: 5
            }
          ]
        }
      ]
    });

    const expected = {
      name: "topic1",
      partitions: [
        {
          topic: "topic1",
          partition: 0,
          leader: 1,
          replicas: [3, 1, 2],
          isr: [1, 3, 2],
          error: "Error Code: 5 - LEADER_NOT_AVAILABLE"
        }
      ]
    };

    const actual = await topic("topic1", { kafkaBrokers: ["broker1:9092"] });
    expect(actual).toEqual(expected);
  });
});
