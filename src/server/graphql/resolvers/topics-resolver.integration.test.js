jest.mock("kafka-node");
const kafkaNode = require("kafka-node");
const topicsResolver = require("./topics-resolver");

describe("topicsResolver", () => {
  const mockContext = {
    kafkaConnectionConfig: { kafkaBrokers: ["broker:9092"] }
  };

  it.only(`Makes a request for the list of topics and returns the value unmodified
  and makes use of cache on the second call`, async () => {
    const expected = [
      {
        name: "topic1",
        partitions: [
          {
            topic: "topic1",
            partition: 0,
            leader: 1,
            replicas: [3, 1, 2],
            isr: [1, 3, 2]
          },
          {
            topic: "topic1",
            partition: 1,
            leader: 1,
            replicas: [3, 1, 2],
            isr: [1, 3, 2]
          }
        ]
      }
    ];

    const actual = await topicsResolver({}, {}, mockContext);
    const actual2 = await topicsResolver({}, {}, mockContext);

    // Should only be called once if cache works on second run
    expect(kafkaNode.Admin).toBeCalledTimes(1);

    expect(actual).toEqual(expected);
    expect(actual2).toEqual(expected);
  });
});
