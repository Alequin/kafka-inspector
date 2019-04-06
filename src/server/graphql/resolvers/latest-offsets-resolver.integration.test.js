const latestOffsetsResolver = require("./latest-offsets-resolver");
jest.mock("server-common/kafka/kafka-connections/kafka-node-offset");
const kafkaNodeOffset = require("server-common/kafka/kafka-connections/kafka-node-offset");
kafkaNodeOffset.mockImplementation(
  jest.requireActual("server-common/kafka/kafka-connections/kafka-node-offset")
);

describe("latestOffsetsResolver", () => {
  const mockContext = {
    kafkaConnectionConfig: { kafkaBrokers: ["broker1:9092"] }
  };

  it("Should return the specific latest offset for the current partition", async () => {
    const targetPartition1 = 0;
    const expected1 = 10;

    const actual1 = await latestOffsetsResolver(
      {
        partitionNumber: targetPartition1,
        metadata: { topic: "topic1" }
      },
      {},
      mockContext
    );

    expect(actual1).toEqual(expected1);

    // -------

    const targetPartition2 = 1;
    const expected2 = 20;

    const actual2 = await latestOffsetsResolver(
      {
        partitionNumber: targetPartition2,
        metadata: { topic: "topic1" }
      },
      {},
      mockContext
    );

    expect(actual2).toEqual(expected2);
  });

  it("Uses the cached version of fetchLatestOffsets, passing the topic name as an argument", async () => {
    const actual = await latestOffsetsResolver(
      {
        partitionNumber: 0,
        metadata: { topic: "topic1" }
      },
      {},
      mockContext
    );
    const expected = await latestOffsetsResolver(
      {
        partitionNumber: 0,
        metadata: { topic: "topic1" }
      },
      {},
      mockContext
    );

    // Only called once if cache works on second time
    expect(kafkaNodeOffset).toHaveBeenCalledTimes(1);
    expect(actual).toEqual(expected);
  });
});
