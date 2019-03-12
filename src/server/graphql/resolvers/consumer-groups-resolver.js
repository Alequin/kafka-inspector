const listConsumerGroupsWithCache = require("server-common/kafka/list-consumer-groups-with-cache");
const consumerGroupInformation = require("server-common/kafka/describe-consumer-group/consumer-group-information");

const consumerGroupResolver = async (
  _parent,
  _args,
  { kafkaConnectionConfig }
) => {
  const consumerGroupNames = await listConsumerGroupsWithCache(
    kafkaConnectionConfig
  );
  const information = await consumerGroupInformation(
    consumerGroupNames,
    kafkaConnectionConfig
  );

  return Object.values(information);
};

module.exports = consumerGroupResolver;
