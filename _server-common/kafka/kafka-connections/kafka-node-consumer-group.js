const kafkaNode = require("kafka-node");
const kafkaNodeClient = require("./kafka-node-client");
const handleKafkaConnectionCallback = require("./handle-kafka-connection-callback");

const kafkaNodeConsumerGroup = (kafkaConnectionConfig, options, callback) => {
  const client = kafkaNodeClient(kafkaConnectionConfig);

  const consumer = new kafkaNode.ConsumerGroup(
    {
      ...client.options,
      ...options
    },
    options.topicsToConsumerFrom
  );

  const closeConnection = () => {
    consumer.close();
    client.close();
  };
  return handleKafkaConnectionCallback(consumer, closeConnection, callback);
};

module.exports = kafkaNodeConsumerGroup;
