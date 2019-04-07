const consumerGroupsResolver = require("./consumer-groups-resolver");

describe("consumerGroupsResolver", () => {
  it("Resolves information on all consumer groups", async () => {
    const expected = [
      {
        members: [
          {
            memberId: "kafka-node-client-1",
            clientId: "kafka-node-client",
            clientHost: "/172.21.17.74",
            memberMetadata: {
              subscription: ["topicName1", "topicName2"],
              version: 0,
              userData: undefined,
              id: "kafka-node-client-1"
            },
            memberAssignment: {
              partitions: {
                topicName1: [0],
                topicName2: [1]
              },
              version: 0
            },
            memberAssignment: [
              { topicName: "topicName1", partitionNumbers: [0] },
              { topicName: "topicName2", partitionNumbers: [1] }
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
            memberAssignment: [
              { topicName: "topicName1", partitionNumbers: [2] }
            ]
          }
        ],
        groupId: "groupName1",
        state: "Stable",
        protocolType: "consumer",
        protocol: "roundrobin",
        brokerId: "3"
      },
      {
        members: [],
        groupId: "groupName2",
        state: "Stable",
        protocolType: "consumer",
        protocol: "roundrobin",
        brokerId: "3"
      }
    ];

    const mockContext = {
      kafkaConnectionConfig: { kafkaBrokers: ["broker1:9092", "broker2:9092"] }
    };
    const actual = await consumerGroupsResolver({}, {}, mockContext);
    expect(actual).toEqual(expected);
  });
});
