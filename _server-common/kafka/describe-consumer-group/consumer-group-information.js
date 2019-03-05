const accessGlobalKafkaConnections = require("../access-global-kafka-connections");

const consumerGroupInformation = consumerGroupName => {
  const {
    kafkaNode: { admin }
  } = accessGlobalKafkaConnections();

  return new Promise((resolve, reject) => {
    admin.describeGroups([consumerGroupName], (error, response) => {
      error ? reject(error) : resolve(response[consumerGroupName]);
    });
  });
};

module.exports = consumerGroupInformation;
