const singleConsumer = require("./single-consumer");

const paginationConsumer = async options => {
  const consumer = consumerIterator(options);
  const allMessages = {};
  for await (const { partition, messages } of consumer()) {
    allMessages[partition] = messages;
  }
  return allMessages;
};

const consumerIterator = ({ topic, partitions, offsetRange }) => {
  return async function*() {
    const orderedPartitions = partitions.sort();
    for (let partition of orderedPartitions) {
      yield {
        partition,
        messages: await singleConsumer({ topic, partition, offsetRange })
      };
    }
  };
};

module.exports = paginationConsumer;
