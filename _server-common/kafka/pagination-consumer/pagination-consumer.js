const singleConsumer = require("./single-consumer");
const checkAgainstLatestOffsetForTopic = require("./check-against-latest-offsets-for-topic");

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
  const checkMaxOffsetAgainstLatest = checkAgainstLatestOffsetForTopic(
    topicName
  );
  return async function*() {
    const orderedPartitions = partitions.sort();
    for (let partition of orderedPartitions) {
      const maxOffset = await checkMaxOffsetAgainstLatest(max, partition);
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
