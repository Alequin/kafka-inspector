const kafkaNode = require("kafka-node");

const kafkaNodeAdmin = ({ kafkaBrokers }, callback) => {
  const client = new kafkaNode.KafkaClient({
    kafkaHost: kafkaBrokers.join(",")
  });
  const admin = new kafkaNode.Admin(client);

  try {
    return callback(admin, client);
  } catch (error) {
    throw error;
  } finally {
    client.close();
  }
};

module.exports = kafkaNodeAdmin;
