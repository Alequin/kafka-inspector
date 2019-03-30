const runQuery = require("../run-query");

const addCluster = async brokers => {
  await runQuery(`INSERT INTO clusters (brokers) VALUES (?)`, [
    brokers.join(",")
  ]);
};

module.exports = addCluster;
