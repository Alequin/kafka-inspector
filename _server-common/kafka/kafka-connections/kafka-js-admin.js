const { Kafka } = require("kafkajs");

const kafkaJsAdmin = ({ kafkaBrokers }, callback) => {
  const kafkaJsClient = new Kafka({
    clientId: "k-inspect.kafkaJs",
    brokers: kafkaBrokers
  });
  const admin = kafkaJsClient.admin();

  try {
    return callback(admin);
  } catch (error) {
    throw error;
  } finally {
    admin.disconnect();
  }
};

module.exports = kafkaJsAdmin;
