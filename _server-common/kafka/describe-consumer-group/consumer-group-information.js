const accessKafkaConnections = require("../access-kafka-connections");

const consumerGroupInformation = consumerGroupName => {
  const {
    kafkaNode: { admin }
  } = accessKafkaConnections();

  return new Promise((resolve, reject) => {
    admin.describeGroups([consumerGroupName], (error, response) => {
      error ? reject(error) : resolve(response[consumerGroupName]);
    });
  });
};

module.exports = consumerGroupInformation;
