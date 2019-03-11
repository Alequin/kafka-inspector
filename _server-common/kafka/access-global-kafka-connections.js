const newClusterConnection = require("./kafka-connections/new-cluster-connection");

const clusters = {};
const accessGlobalKafkaConnections = ({ kafkaBrokers } = {}) => {
  if (!kafkaBrokers)
    throw new Error(
      "No Kafka brokers have been defined in kafkaConnectionConfig. This is required"
    );

  if (!clusters[kafkaBrokers]) {
    clusters[kafkaBrokers] = newClusterConnection(kafkaBrokers);
  }

  return clusters[kafkaBrokers];
};

module.exports = accessGlobalKafkaConnections;
