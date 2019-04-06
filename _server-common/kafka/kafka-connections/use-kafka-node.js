const kafkaNode = require("kafka-node");
const kafkaNodeClient = require("./kafka-node-client");

const useKafkaNode = requestedAspect => {
  return (kafkaConnectionConfig, callback) => {
    const client = kafkaNodeClient(kafkaConnectionConfig);

    const aspectToUse = new kafkaNode[requestedAspect](client);

    try {
      return callback(aspectToUse, client);
    } catch (error) {
      throw error;
    } finally {
      client.close();
    }
  };
};

module.exports = useKafkaNode;
