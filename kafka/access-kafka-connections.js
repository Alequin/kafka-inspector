const { Kafka } = require("kafkajs");
const kafka = require("kafka-node");
const kafkaConfig = require("./kafka-config");

const kafkaNode = () => {
  let kafkaNodeClient = null;
  let kafkaNodeAdmin = null;

  return () => {
    const isKafkaNodeConnected = kafkaNodeClient && !kafkaNodeClient.closing;
    if (!isKafkaNodeConnected) {
      kafkaNodeClient = new kafka.KafkaClient({
        kafkaHost: kafkaConfig.brokers.join(",")
      });
      kafkaNodeAdmin = new kafka.Admin(kafkaNodeClient);
    }

    return {
      client: kafkaNodeClient,
      admin: kafkaNodeAdmin
    };
  };
};

const kafkaJs = () => {
  const kafkaJsClient = new Kafka({
    clientId: "k-inspect.kafkaJs",
    brokers: kafkaConfig.brokers
  });
  let kafkaJsAdmin = null;

  return () => {
    const isKafkaJsAdminConnected = kafkaJsAdmin && kafkaJsAdmin.connected;
    if (!isKafkaJsAdminConnected) {
      kafkaJsAdmin = kafkaJsClient.admin();
      // Provide a simple boolean value to check if admin connection is open
      kafkaJsAdmin.connected = true;
      kafkaJsAdmin.close = () => {
        kafkaJsAdmin.disconnect();
        kafkaJsAdmin.connected = false;
      };

      // In case disconnect is used over close.
      // As this is an event there is a small chance of race conditions,
      // meaning the value may not be set fast enough.
      kafkaJsAdmin.on(kafkaJsAdmin.events.DISCONNECT, () => {
        kafkaJsAdmin.connected = false;
      });
    }

    return {
      client: kafkaJsClient,
      admin: kafkaJsAdmin
    };
  };
};

const accessGlobalKafkaNodeConnection = kafkaNode();
const accessGlobalKafkaJsConnection = kafkaJs();

const accessKafkaConnections = () => {
  return {
    kafkaNode: accessGlobalKafkaNodeConnection(),
    kafkaJs: accessGlobalKafkaJsConnection()
  };
};

module.exports = accessKafkaConnections;
