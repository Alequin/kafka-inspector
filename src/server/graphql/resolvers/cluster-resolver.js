const clusterResolver = (_parent, { kafkaBrokers }, context) => {
  context.kafkaConnectionConfig = Object.freeze({
    kafkaBrokers
  });
  return {};
};

module.exports = clusterResolver;
