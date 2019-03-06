const singleConsumer = require("./single-consumer");
const fetchLatestOffset = require("./../describe-consumer-group/fetch-latest-offsets");

const paginationConsumer = async options => {
  const consumer = await consumerIterator(options);
  const allMessages = {};
  for await (const { partition, messages } of consumer()) {
    allMessages[partition] = messages;
  }
  return allMessages;
};

const consumerIterator = async ({
  topicName,
  partitions,
  offsetRange: { min, max }
}) => {
  const latestOffsets = await fetchLatestOffset(topicName);
  return async function*() {
    const orderedPartitions = partitions.sort();
    for (let partition of orderedPartitions) {
      const maxOffset = Math.min(max, latestOffsets[partition]);
      yield {
        partition,
        messages: await singleConsumer({
          topicName,
          partition,
          offsetRange: { min, max: maxOffset }
        })
      };
    }
  };
};

module.exports = paginationConsumer;
