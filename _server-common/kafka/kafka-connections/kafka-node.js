const kafka = require("kafka-node");

const newClient = kafkaBrokers => {
  return new kafka.KafkaClient({
    kafkaHost: kafkaBrokers.join(",")
  });
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
      consumerGroupStream: options => {
        return new kafka.ConsumerGroupStream(
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
