const consumerGroupInformation = require("server-common/kafka/describe-consumer-group/consumer-group-information");

const consumerGroupResolver = async (
  _parent,
  { groupName },
  { kafkaConnectionConfig }
) => {
  const information = await consumerGroupInformation(
    [groupName],
    kafkaConnectionConfig
  );

  return information[groupName];
};

module.exports = consumerGroupResolver;
