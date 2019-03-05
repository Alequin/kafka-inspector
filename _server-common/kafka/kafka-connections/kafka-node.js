const kafka = require("kafka-node");
const kafkaConfig = require("../kafka-config");

const kafkaNode = () => {
  let kafkaNodeClient = null;
  let kafkaNodeAdmin = null;
  let kafkaNodeOffset = null;

  return () => {
    const isKafkaNodeConnected = kafkaNodeClient && !kafkaNodeClient.closing;
    if (!isKafkaNodeConnected) {
      kafkaNodeClient = new kafka.KafkaClient({
        kafkaHost: kafkaConfig.brokers.join(",")
      });
      kafkaNodeAdmin = new kafka.Admin(kafkaNodeClient);
      kafkaNodeOffset = new kafka.Offset(kafkaNodeClient);
    }

    return {
      client: kafkaNodeClient,
      admin: kafkaNodeAdmin,
      offset: kafkaNodeOffset,
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
