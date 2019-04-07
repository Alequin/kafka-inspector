const consumerGroupResolver = require("./consumer-group-resolver");

describe("consumerGroupResolver", () => {
  const mockContext = {
    kafkaConnectionConfig: { kafkaBrokers: ["broker1:9092"] }
  };

  it("Resolves information on a single consumer group", async () => {
    const topicName1 = "topicName1";
    const topicName2 = "topicName2";
    const groupName1 = "groupName1";

    const expected = {
      members: [
        {
          memberId: "kafka-node-client-1",
          clientId: "kafka-node-client",
          clientHost: "/172.21.17.74",
          memberMetadata: {
            subscription: [topicName1, topicName2],
            version: 0,
            userData: undefined,
            id: "kafka-node-client-1"
          },
          memberAssignment: [
            { topicName: topicName1, partitionNumbers: [0] },
            { topicName: topicName2, partitionNumbers: [1] }
          ]
        },
        {
          memberId: "kafka-node-client-2",
          clientId: "kafka-node-client",
          clientHost: "/172.21.17.74",
          memberMetadata: {
            subscription: ["topicName1"],
            version: 0,
            userData: undefined,
            id: "kafka-node-client-2"
          },
          memberAssignment: [{ topicName: topicName1, partitionNumbers: [2] }]
        }
      ],
      groupId: groupName1,
      state: "Stable",
      protocolType: "consumer",
      protocol: "roundrobin",
      brokerId: "3"
    };

    const actual = await consumerGroupResolver(
      {},
      { groupName: "consumerGroup1" },
      mockContext
    );

    expect(actual).toEqual(expected);
  });
});
