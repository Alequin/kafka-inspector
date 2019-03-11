require("events").EventEmitter.defaultMaxListeners = 1000;

const confirmRequestedBrokersAreValid = require("./confirm-requested-brokers-are-available");
const kafkaNode = require("./kafka-node");
const kafkaJs = require("./kafka-js");

const newClusterConnection = kafkaBrokers => {
  confirmRequestedBrokersAreValid(kafkaBrokers);
  const accessGlobalKafkaNodeConnection = kafkaNode(kafkaBrokers);
  const accessGlobalKafkaJsConnection = kafkaJs(kafkaBrokers);
  return {
    kafkaNode: accessGlobalKafkaNodeConnection(),
    kafkaJs: accessGlobalKafkaJsConnection()
  };
};

module.exports = newClusterConnection;
