const mockGetTopicMetadataReturnValue = {
  topics: [
    {
      topics: "topic1",
      partitions: [
        {
          partitionId: 1,
          partitionErrorCode: 0,
          leader: 1,
          replicas: [3, 1, 2],
          isr: [1, 3, 2]
        },
        {
          partitionId: 0,
          partitionErrorCode: 5,
          leader: 1,
          replicas: [3, 1, 2],
          isr: [1, 3, 2]
        }
      ]
    }
  ]
};

module.exports = {
  Kafka: function() {
    this.admin = () => {
      return {
        getTopicMetadata: () => mockGetTopicMetadataReturnValue,
        disconnect: () => {}
      };
    };
  }
};
