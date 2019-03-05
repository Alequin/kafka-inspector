require("events").EventEmitter.defaultMaxListeners = 1000;

const kafkaNode = require("./kafka-connections/kafka-node");
const kafkaJs = require("./kafka-connections/kafka-js");

const accessGlobalKafkaNodeConnection = kafkaNode();
const accessGlobalKafkaJsConnection = kafkaJs();

const accessKafkaConnections = () => {
  return {
    kafkaNode: accessGlobalKafkaNodeConnection(),
    kafkaJs: accessGlobalKafkaJsConnection()
  };
};

module.exports = accessKafkaConnections;
