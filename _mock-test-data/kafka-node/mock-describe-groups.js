const consumerGroupName = "group1";

const groupInformation = {
  members: [],
  protocolType: "consumer"
};

const response = {
  [consumerGroupName]: groupInformation
};

module.exports = {
  response,
  groupInformation,
  consumerGroupName
};
