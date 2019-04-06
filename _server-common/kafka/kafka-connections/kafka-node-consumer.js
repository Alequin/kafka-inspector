const kafkaNode = require("kafka-node");
const kafkaNodeClient = require("./kafka-node-client");
const handleKafkaConnectionCallback = require("./handle-kafka-connection-callback");

const kafkaNodeConsumer = (kafkaConnectionConfig, options, callback) => {
  const client = kafkaNodeClient(kafkaConnectionConfig);

  const consumer = new kafkaNode.Consumer(
    client,
    options.topicsToConsumerFrom,
    { ...options }
  );

  const closeConnection = () => {
    consumer.close();
    client.close();
  };
  return handleKafkaConnectionCallback(consumer, closeConnection, callback);
};

module.exports = kafkaNodeConsumer;
