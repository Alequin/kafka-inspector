const createConsumerManager = require("./create-consumer-manager");

const consumeMessages = async (consumer, maxOffset) => {
  return new Promise(resolve => {
    const consumerManager = createConsumerManager(maxOffset);
    consumer.on("message", message => {
      const { shouldCloseConsumer, messages } = consumerManager(message);
      if (shouldCloseConsumer) {
        consumer.close();
        resolve(messages);
      }
    });
  });
};

module.exports = consumeMessages;
