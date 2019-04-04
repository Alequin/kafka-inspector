const kafkaNode = require("kafka-node");

const kafkaNodeAdmin = ({ kafkaBrokers }) => {
  const client = new kafkaNode.KafkaClient(kafkaBrokers.join(","));
  return new kafkaNode.Admin(client);
};

module.exports = kafkaNodeAdmin;
