const kafkaNode = require("kafka-node");
const kafkaNodeClient = require("./kafka-node-client");

const kafkaNodeConsumer = (kafkaConnectionConfig, options, callback) => {
  const client = kafkaNodeClient(kafkaConnectionConfig);

  const consumer = new kafkaNode.Consumer(
    client,
    options.topicsToConsumerFrom,
    { ...options }
  );

  try {
    return callback(consumer);
  } catch (error) {
    throw error;
  } finally {
    client.close();
  }
};

module.exports = kafkaNodeConsumer;
