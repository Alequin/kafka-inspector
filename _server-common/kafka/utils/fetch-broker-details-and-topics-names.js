const kafkaNodeAdmin = require("../kafka-connections/kafka-node-admin");

const fetchBrokerDetailsAndTopicNames = async kafkaConnectionConfig => {
  return kafkaNodeAdmin(kafkaConnectionConfig, resolveBrokerDetails);
};

const resolveBrokerDetails = admin =>
  new Promise((resolve, reject) => {
    admin.listTopics((error, response) => {
      error ? reject(error) : resolve(response);
    });
  });

module.exports = fetchBrokerDetailsAndTopicNames;
