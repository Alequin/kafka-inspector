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

const mockConfigEntry = [
  {
    configName: "compression.type",
    configValue: "producer",
    readOnly: false,
    isDefault: true,
    isSensitive: false
  }
];
const mockDescribeConfigsReturnValue = {
  resources: [
    {
      errorCode: 0,
      errorMessage: null,
      configEntries: mockConfigEntry
    }
  ]
};

module.exports = {
  Kafka: function() {
    this.admin = () => {
      return {
        describeConfigs: () => mockDescribeConfigsReturnValue,
        getTopicMetadata: () => mockGetTopicMetadataReturnValue,
        disconnect: () => {}
      };
    };
  }
};
