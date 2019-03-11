require("events").EventEmitter.defaultMaxListeners = 1000;

const tcpp = require("tcp-ping");
const kafkaNode = require("./kafka-node");
const kafkaJs = require("./kafka-js");

const isBrokerAvailable = broker => {
  const [brokerHost, port] = broker.split(":");
  tcpp.probe(brokerHost, port, (error, available) => {
    if (error) {
      throw new Error(
        "There was an error while checking if the broker was available: " +
          error
      );
    }
    if (!available) {
      throw new Error(
        `broker not available: ${broker} / (make sure the provided format is '<broker-address>:<port>')`
      );
    }
  });
};

const confirmRequestedBrokersAreValid = kafkaBrokers => {
  for (const broker of kafkaBrokers) {
    isBrokerAvailable(broker);
  }
};

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
