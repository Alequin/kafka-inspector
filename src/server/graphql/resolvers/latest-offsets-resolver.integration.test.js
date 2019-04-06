const mockTopic = require("mock-test-data/data/mock-topics");
const mockTopicOffsets = require("mock-test-data/data/mock-topic-offsets");

const latestOffsetsResolver = require("./latest-offsets-resolver");

describe.skip("latestOffsetsResolver", () => {
  const mockContext = {
    kafkaConnectionConfig: { kafkaBrokers: ["broker1:9092"] }
  };

  it.only("Should return the specific latest offset for the current partition", async () => {
    const expected1 = 10;
    const targetPartition1 = 0;
    const actual1 = await latestOffsetsResolver(
      {
        partitionNumber: targetPartition1,
        metadata: { topic: mockTopic.topic1 }
      },
      {},
      mockContext
    );

    expect(actual1).toEqual(expected1);

    // -------

    const expected2 = 20;
    const targetPartition2 = 1;
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
    await latestOffsetsResolver(
      {
        partitionNumber: 0,
        metadata: { topic: "topic1" }
      },
      {},
      mockContext
    );

    expect(fetchLatestOffsetsWithCache).toBeCalledTimes(1);
    expect(fetchLatestOffsetsWithCache).toBeCalledWith(
      mockTopic.topic1,
      mockContext.kafkaConnectionConfig
    );
  });
});
