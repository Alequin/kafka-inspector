const kafkaNode = require("kafka-node");
const kafkaNodeClient = require("./kafka-node-client");

const kafkaNodeOffset = (kafkaConfigSettings, callback) => {
  const client = kafkaNodeClient(kafkaConfigSettings);
  const admin = new kafkaNode.Offset(client);

  try {
    return callback(admin, client);
  } catch (error) {
    throw error;
  } finally {
    client.close();
  }
};

module.exports = kafkaNodeOffset;
