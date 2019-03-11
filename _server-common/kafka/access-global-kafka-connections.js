const newClusterConnection = require("./kafka-connections/new-cluster-connection");

const clusters = {};
const accessGlobalKafkaConnections = kafkaConnectionConfig => {
  if (!kafkaConnectionConfig || !kafkaConnectionConfig.kafkaBrokers)
    throw new Error(
      "No Kafka brokers have been defined in kafkaConnectionConfig. This is required"
    );

  const { kafkaBrokers } = kafkaConnectionConfig;
  if (!clusters[kafkaBrokers]) {
    clusters[kafkaBrokers] = newClusterConnection(kafkaBrokers);
  }

  return clusters[kafkaBrokers];
};

module.exports = accessGlobalKafkaConnections;
