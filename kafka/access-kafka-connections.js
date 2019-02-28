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
  const kafkaJsAdmin = null;

  return () => {
    const isKafkaJsAdminConnected = kafkaJs.admin.connected;
    if (!isKafkaJsAdminConnected) {
      kafkaJsAdmin = kafkaJsClient.admin();
      // Provide a simple boolean value to check if admin connection is open
      kafkaJsAdmin.connected = true;
      kafkaJsAdmin.close = () => {
        kafkaJsAdmin.disconnect();
        kafkaJsAdmin.connected = false;
      };
    }

    return {
      client: kafkaJsClient,
      admin: kafkaJsAdmin
    };
  };
};

const accessGlobalKafkaNodeConnection = kafkaNode();
const accessGlobalKafkaJsConnection = kafkaNode();

const accessKafkaConnections = () => {
  return {
    kafkaNode: accessGlobalKafkaNodeConnection(),
    kafkaJs: accessGlobalKafkaJsConnection()
  };
};

module.exports = accessKafkaConnections;
