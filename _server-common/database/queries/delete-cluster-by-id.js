const runQuery = require("../run-query");

const deleteClusterById = async id => {
  await runQuery(`DELETE FROM clusters WHERE id=?`, [id]);
};

module.exports = deleteClusterById;
