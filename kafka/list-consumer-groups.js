const listConsumerGroups = async ({ kafkaNode }) => {
  return new Promise((resolve, reject) => {
    kafkaNode.admin.listGroups((error, response) => {
      error ? reject(error) : resolve(mapConsumerGroupsToList(response));
    });
  });
};

const mapConsumerGroupsToList = consumerGroupsObject => {
  return Object.keys(consumerGroupsObject);
};

module.exports = listConsumerGroups;
