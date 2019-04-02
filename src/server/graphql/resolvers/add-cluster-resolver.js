const confirmRequestedBrokersAreValid = require("server-common/kafka/kafka-connections/confirm-requested-brokers-are-available");
const addCluster = require("server-common/database/queries/add-cluster");

const addClusterResolver = async (_parent, { kafkaBrokers }) => {
  await confirmRequestedBrokersAreValid(kafkaBrokers);
  await addCluster(kafkaBrokers);
  return "Success";
};

module.exports = addClusterResolver;
