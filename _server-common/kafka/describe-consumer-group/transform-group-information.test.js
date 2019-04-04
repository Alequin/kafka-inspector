const transformGroupInformation = require("./transform-group-information");

describe.skip("transformGroupInformation", () => {
  const topicName1 = "topic1";
  const topicName2 = "topic2";
  const groupName1 = "group1";
  const groupName2 = "group2";

  const mockGroupInformation = {
    [groupName1]: {
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
          memberAssignment: {
            partitions: {
              [topicName1]: [0],
              [topicName2]: [1]
            },
            version: 0
          }
        },
        {
          memberId: "kafka-node-client-2",
          clientId: "kafka-node-client",
          clientHost: "/172.21.17.74",
          memberMetadata: {
            subscription: [topicName1],
            version: 0,
            userData: undefined,
            id: "kafka-node-client-2"
          },
          memberAssignment: {
            partitions: {
              [topicName1]: [2]
            },
            version: 0
          }
        }
      ],
      groupId: groupName1,
      state: "Stable",
      protocolType: "consumer",
      protocol: "roundrobin",
      brokerId: "3"
    },
    [groupName2]: {
      members: [],
      groupId: groupName2,
      state: "Stable",
      protocolType: "consumer",
      protocol: "roundrobin",
      brokerId: "3"
    }
  };

  it("Transforms groups information to the expected shape", () => {
    const expected = {
      [groupName1]: {
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
              subscription: [topicName1],
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
      },
      [groupName2]: {
        members: [],
        groupId: groupName2,
        state: "Stable",
        protocolType: "consumer",
        protocol: "roundrobin",
        brokerId: "3"
      }
    };

    const actual = transformGroupInformation(mockGroupInformation);

    expect(actual).toEqual(expected);
  });
});
