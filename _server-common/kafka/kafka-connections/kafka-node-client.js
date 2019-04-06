const kafkaNode = require("kafka-node");

const kafkaNodeAdmin = ({ kafkaBrokers }) =>
  new kafkaNode.KafkaClient({
    kafkaHost: kafkaBrokers.join(",")
  });

module.exports = kafkaNodeAdmin;
