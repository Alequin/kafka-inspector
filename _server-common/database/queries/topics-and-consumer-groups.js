const runQuery = require("../run-query");

const topicsAndConsumerGroups = async () => {
  return await runQuery("SELECT * FROM topicsAndConsumerGroups");
};

module.exports = topicsAndConsumerGroups;
