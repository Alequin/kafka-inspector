const { map, mapValues } = require("lodash");

const transformMembersAssignments = ({ partitions }) => {
  return map(partitions, (partitionNumbers, topicName) => {
    return {
      topicName,
      partitionNumbers
    };
  });
};

const transformMembers = members => {
  return map(members, member => {
    return {
      ...member,
      memberAssignment: transformMembersAssignments(member.memberAssignment)
    };
  });
};

const transformGroupInformation = consumerGroups => {
  return mapValues(consumerGroups, group => {
    return {
      ...group,
      members: transformMembers(group.members)
    };
  });
};

module.exports = transformGroupInformation;
