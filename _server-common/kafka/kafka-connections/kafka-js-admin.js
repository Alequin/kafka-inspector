const { Kafka } = require("kafkajs");
const handleKafkaConnectionCallback = require("./handle-kafka-connection-callback");

const kafkaJsAdmin = ({ kafkaBrokers }, callback) => {
  const kafkaJsClient = new Kafka({
    clientId: "k-inspect.kafkaJs",
    brokers: kafkaBrokers
  });
  const admin = kafkaJsClient.admin();

  const closeConnection = () => admin.disconnect();
  return handleKafkaConnectionCallback(admin, closeConnection, callback);
};

module.exports = kafkaJsAdmin;
