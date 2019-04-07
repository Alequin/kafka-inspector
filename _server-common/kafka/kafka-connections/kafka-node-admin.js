const kafkaNode = require("kafka-node");
const kafkaNodeClient = require("./kafka-node-client");
const handleKafkaConnectionCallback = require("./handle-kafka-connection-callback");

const kafkaNodeAdmin = (kafkaConnectionConfig, callback) => {
  const client = kafkaNodeClient(kafkaConnectionConfig);
  const admin = new kafkaNode.Admin(client);
  const closeConnection = () => client.close();
  return handleKafkaConnectionCallback(admin, closeConnection, callback);
};

module.exports = kafkaNodeAdmin;
