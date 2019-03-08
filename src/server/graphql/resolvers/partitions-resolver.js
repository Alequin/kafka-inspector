const omit = require("lodash/omit");

const transformPartitionToFitGqlType = partition => {
  return {
    ...omit(partition, ["isr", "partition"]),
    inSyncReplicas: partition.isr,
    partitionNumber: partition.partition
  };
};

const filterByPartitionNumber = selectedPartitionNumbers => {
  return ({ partition: partitionNumber }) => {
    return selectedPartitionNumbers.includes(partitionNumber);
  };
};

const partitionsResolver = ({ partitions }, { partitionNumbers }) => {
  const shouldFilterPartitionsByNumber = !!partitionNumbers;
  const selectedPartitions = shouldFilterPartitionsByNumber
    ? partitions.filter(filterByPartitionNumber(partitionNumbers))
    : partitions;

  return selectedPartitions.map(transformPartitionToFitGqlType);
};

module.exports = partitionsResolver;
