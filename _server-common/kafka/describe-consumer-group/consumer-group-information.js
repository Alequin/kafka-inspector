const kafkaNodeAdmin = require("../kafka-connections/kafka-node-admin");
const transformGroupInformation = require("./transform-group-information");

const resolveConsumerGroupInformation = consumerGroupNames => admin =>
  new Promise((resolve, reject) => {
    admin.describeGroups(consumerGroupNames, (error, response) => {
      error ? reject(error) : resolve(transformGroupInformation(response));
    });
  });

const consumerGroupInformation = (
  consumerGroupNames,
  kafkaConnectionConfig
) => {
  return kafkaNodeAdmin(
    kafkaConnectionConfig,
    resolveConsumerGroupInformation(consumerGroupNames)
  );
};

module.exports = consumerGroupInformation;
