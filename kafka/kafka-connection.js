const { Kafka } = require("kafkajs");
const kafka = require("kafka-node");
const kafkaConfig = require("./kafka-config");

const connectKafkaNode = () => {
  const kafkaNodeClient = new kafka.KafkaClient({
    kafkaHost: kafkaConfig.brokers.join(",")
  });
  const kafkaNodeAdmin = new kafka.Admin(kafkaNodeClient);

  return {
    client: kafkaNodeClient,
    admin: kafkaNodeAdmin
  };
};

const connectKafkaJs = () => {
  const kafkaJsClient = new Kafka({
    clientId: "my-app",
    brokers: kafkaConfig.brokers
  });

  return {
    client: kafkaJsClient,
    admin: kafkaJsClient.admin()
  };
};

const kafkaNode = connectKafkaNode();
const kafkaJs = connectKafkaJs();

module.exports = {
  kafkaNode,
  kafkaJs
};
