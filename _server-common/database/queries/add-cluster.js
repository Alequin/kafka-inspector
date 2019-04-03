const runQuery = require("../run-query");

const addCluster = async (name, brokers) => {
  await runQuery(`INSERT INTO clusters (name, brokers) VALUES (?, ?)`, [
    name,
    brokers.join(",")
  ]);
};

module.exports = addCluster;
