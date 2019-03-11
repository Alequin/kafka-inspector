require("events").EventEmitter.defaultMaxListeners = 1000;

const confirmRequestedBrokersAreValid = require("./confirm-requested-brokers-are-available");
const kafkaNode = require("./kafka-node");
const kafkaJs = require("./kafka-js");

const newClusterConnection = kafkaBrokers => {
  confirmRequestedBrokersAreValid(kafkaBrokers);
  const accessKafkaNodeConnection = kafkaNode(kafkaBrokers);
  const accessKafkaJsConnection = kafkaJs(kafkaBrokers);
  return {
    kafkaNode: accessKafkaNodeConnection(),
    kafkaJs: accessKafkaJsConnection()
  };
};

module.exports = newClusterConnection;
