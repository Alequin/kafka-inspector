const accessGlobalKafkaConnections = require("../access-global-kafka-connections");
const transformGroupInformation = require("./transform-group-information");

const consumerGroupInformation = (
  consumerGroupNames,
  kafkaConnectionConfig
) => {
  const {
    kafkaNode: { admin }
  } = accessGlobalKafkaConnections(kafkaConnectionConfig);

  return new Promise((resolve, reject) => {
    admin.describeGroups(consumerGroupNames, (error, response) => {
      error ? reject(error) : resolve(transformGroupInformation(response));
    });
  });
};

module.exports = consumerGroupInformation;
