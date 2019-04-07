const offsetsResolver = require("./offsets-resolver");

describe("offsetsResolver", () => {
  it("Gathers and returns a summary of offset details from the requested consumer group", async () => {
    const expected = {
      sumOfLatestOffsets: 60,
      sumOfCommittedOffsets: 27,
      sumOfLag: 33,
      partitions: [
        { partitionNumber: 0, latestOffset: 10, committedOffset: 4, lag: 6 },
        { partitionNumber: 1, latestOffset: 20, committedOffset: 9, lag: 11 },
        { partitionNumber: 2, latestOffset: 30, committedOffset: 14, lag: 16 }
      ]
    };
    const actual = await offsetsResolver(
      {},
      {
        topicName: "topic1",
        consumerGroupName: "consumerGroup1"
      },
      { kafkaConnectionConfig: { kafkaBrokers: ["broker1"] } }
    );

    expect(actual).toEqual(expected);
  });
});
