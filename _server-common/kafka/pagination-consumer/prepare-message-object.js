const prepareMessagesObject = partitions => {
  return partitions.reduce((messages, partitionNumber) => {
    messages[partitionNumber] = [];
    return messages;
  }, {});
};

module.exports = prepareMessagesObject;
