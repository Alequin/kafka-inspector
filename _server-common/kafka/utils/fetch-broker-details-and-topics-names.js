const kafkaNodeAdmin = require("../kafka-connections/kafka-node-admin");

const fetchBrokerDetailsAndTopicNames = async kafkaConfigSettings => {
  const admin = kafkaNodeAdmin(kafkaConfigSettings);
  return new Promise((resolve, reject) => {
    admin.listTopics((error, response) => {
      error ? reject(error) : resolve(response);
    });
  });
};

module.exports = fetchBrokerDetailsAndTopicNames;
