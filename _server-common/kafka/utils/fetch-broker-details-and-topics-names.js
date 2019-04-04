const kafkaNode = require("kafka-node");

const fetchBrokerDetailsAndTopicNames = async ({ kafkaBrokers }) => {
  const client = new kafkaNode.KafkaClient(kafkaBrokers.join(","));
  const admin = new kafkaNode.Admin(client);

  return new Promise((resolve, reject) => {
    admin.listTopics((error, response) => {
      error ? reject(error) : resolve(response);
    });
  });
};

module.exports = fetchBrokerDetailsAndTopicNames;
