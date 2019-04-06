const kafkaNode = require("kafka-node");
const kafkaNodeClient = require("./kafka-node-client");
const handleKafkaConnectionCallback = require("./handle-kafka-connection-callback");

const kafkaNodeOffset = (kafkaConnectionConfig, callback) => {
  const client = kafkaNodeClient(kafkaConnectionConfig);
  const offset = new kafkaNode.Offset(client);
  const closeConnection = () => client.close;
  return handleKafkaConnectionCallback(offset, closeConnection, callback);
};

module.exports = kafkaNodeOffset;
