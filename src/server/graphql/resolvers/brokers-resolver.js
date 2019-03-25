const brokers = require("server-common/kafka/brokers");

const brokersResolver = async (_parent, _args, { kafkaConnectionConfig }) => {
  return await brokers(kafkaConnectionConfig);
};

module.exports = brokersResolver;
