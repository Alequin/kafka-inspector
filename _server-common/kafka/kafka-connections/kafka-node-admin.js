const kafkaNode = require("kafka-node");
const kafkaNodeClient = require("./kafka-node-client");

const kafkaNodeAdmin = (kafkaConfigSettings, callback) => {
  const client = kafkaNodeClient(kafkaConfigSettings);
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
