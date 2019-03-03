const { query } = require("../sqlite-connections");

const topicsAndConsumerGroups = async () => {
  return await query("SELECT * FROM topicsAndConsumerGroups");
};

module.exports = topicsAndConsumerGroups;
