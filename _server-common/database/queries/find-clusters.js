const runQuery = require("../run-query");

const addCluster = async () => {
  const clusters = await runQuery(`SELECT * FROM clusters`);
  return clusters.map(cluster => {
    return {
      ...cluster,
      brokers: cluster.brokers.split(",")
    };
  });
};

module.exports = addCluster;
