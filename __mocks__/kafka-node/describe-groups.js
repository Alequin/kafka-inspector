module.exports = {
  consumerGroup1: {
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
        }
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
        memberAssignment: {
          partitions: {
            topicName1: [2]
          },
          version: 0
        }
      }
    ],
    groupId: "groupName1",
    state: "Stable",
    protocolType: "consumer",
    protocol: "roundrobin",
    brokerId: "3"
  },
  groupName2: {
    members: [],
    groupId: "groupName2",
    state: "Stable",
    protocolType: "consumer",
    protocol: "roundrobin",
    brokerId: "3"
  }
};
