const kafkaNodeAdmin = require("../kafka-connections/kafka-node-admin");

const fetchBrokerDetailsAndTopicNames = async kafkaConfigSettings => {
  return kafkaNodeAdmin(kafkaConfigSettings, resolveBrokerDetails);
};

const resolveBrokerDetails = admin =>
  new Promise((resolve, reject) => {
    admin.listTopics((error, response) => {
      error ? reject(error) : resolve(response);
    });
  });

module.exports = fetchBrokerDetailsAndTopicNames;
