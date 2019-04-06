const kafkaNode = require("kafka-node");

const kafkaNodeAdmin = ({ kafkaBrokers }, callback) => {
  const client = new kafkaNode.KafkaClient({
    kafkaHost: kafkaBrokers.join(",")
  });
  const admin = new kafkaNode.Admin(client);

  return new Promise(resolve => {
    resolve(callback(admin, client));
  })
    .then(client.close)
    .catch(error => {
      client.close();
      throw error;
    });
};

module.exports = kafkaNodeAdmin;
