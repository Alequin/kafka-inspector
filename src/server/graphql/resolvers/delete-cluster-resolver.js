const deleteClusterById = require("server-common/database/queries/delete-cluster-by-id");

const deleteClusterResolver = async (_parent, { clusterRowId }) => {
  await deleteClusterById(clusterRowId);
  return "Success";
};

module.exports = deleteClusterResolver;
