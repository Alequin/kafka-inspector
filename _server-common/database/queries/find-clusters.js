const runQuery = require("../run-query");

const addCluster = async () => {
  const clusters = await runQuery(`SELECT * FROM clusters`);
  return clusters.map(({ id, brokers }) => {
    return {
      id,
      brokers: brokers.split(",")
    };
  });
};

module.exports = addCluster;
