const messagesByPartitionResolver = (parent, _args, context) => {
  console.log(parent);

  return [
    {
      topicName: "name",
      partitionNumber: 0,
      messages: []
    }
  ];
};

module.exports = messagesByPartitionResolver;
