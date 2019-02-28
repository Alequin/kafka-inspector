const kafkaNode = require("./kafka-utils/kafka-node");
const kafkaJs = require("./kafka-utils/kafka-js");

const accessGlobalKafkaNodeConnection = kafkaNode();
const accessGlobalKafkaJsConnection = kafkaJs();

const accessKafkaConnections = () => {
  return {
    kafkaNode: accessGlobalKafkaNodeConnection(),
    kafkaJs: accessGlobalKafkaJsConnection()
  };
};

module.exports = accessKafkaConnections;
