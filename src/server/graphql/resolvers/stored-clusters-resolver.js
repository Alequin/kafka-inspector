const findClusters = require("server-common/database/queries/find-clusters");

const storedClustersResolver = async () => {
  return await findClusters();
};

module.exports = storedClustersResolver;
