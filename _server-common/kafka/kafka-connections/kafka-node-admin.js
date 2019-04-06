const kafkaNode = require("kafka-node");
const kafkaNodeClient = require("./kafka-node-client");

const kafkaNodeAdmin = (kafkaConnectionConfig, callback) => {
  const client = kafkaNodeClient(kafkaConnectionConfig);
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
