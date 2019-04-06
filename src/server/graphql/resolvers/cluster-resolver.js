const {
  validateBrokerFormat
} = require("server-common/kafka/kafka-connections/broker-format");

const clusterResolver = (_parent, { kafkaBrokers }, context) => {
  kafkaBrokers.forEach(validateBrokerFormat);

  context.kafkaConnectionConfig = Object.freeze({
    kafkaBrokers
  });
  return {};
};

module.exports = clusterResolver;
