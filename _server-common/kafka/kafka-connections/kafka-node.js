const kafka = require("kafka-node");
const { isString } = require("lodash");

const newClient = kafkaBrokers => {
  return new kafka.KafkaClient({
    kafkaHost: kafkaBrokers.join(",")
  });
};

const validateConsumerGroupName = name => {
  const consumerGroupName = name || undefined;
  if (consumerGroupName && !isString(consumerGroupName)) {
    throw new Error("Requested groupId must be a string");
  }
};

const kafkaNode = kafkaBrokers => {
  let kafkaNodeClient = null;
  let kafkaNodeAdmin = null;
  let kafkaNodeOffset = null;

  return () => {
    const isKafkaNodeConnected = kafkaNodeClient && !kafkaNodeClient.closing;
    if (!isKafkaNodeConnected) {
      kafkaNodeClient = newClient(kafkaBrokers);
      kafkaNodeAdmin = new kafka.Admin(kafkaNodeClient);
      kafkaNodeOffset = new kafka.Offset(kafkaNodeClient);
    }

    return {
      client: kafkaNodeClient,
      admin: kafkaNodeAdmin,
      offset: kafkaNodeOffset,
      consumer: (topics, options) => {
        return new kafka.Consumer(newClient(kafkaBrokers), topics, options);
      },
      consumerGroup: options => {
        validateConsumerGroupName(options.groupId);
        return new kafka.ConsumerGroup(
          {
            ...kafkaNodeClient.options,
            ...options
          },
          options.topicNames
        );
      }
    };
  };
};

module.exports = kafkaNode;
