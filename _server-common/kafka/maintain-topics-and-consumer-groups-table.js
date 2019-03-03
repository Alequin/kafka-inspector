const { seconds } = require("server-common/time-to-milliseconds");
const { uniqBy } = require("lodash");
const topicsAndConsumerGroups = require("server-common/database/queries/topics-and-consumer-groups");
const deleteByTopicName = require("server-common/database/queries/delete-by-topic-name");
const deleteByConsumerGroupName = require("server-common/database/queries/delete-by-consumer-group-name");
const checkForDeletedTopicsOrConsumerGroups = require("./save-topic-consumer-group-associations/check-for-deleted-topics-or-consumer-groups");
const topicAndConsumerGroupDetailsFromMessage = require("./save-topic-consumer-group-associations/topic-and-consumer-group-details-from-message");
const accessKafkaConnections = require("./access-kafka-connections");
const upsertToTopicAndConsumerGroupTable = require("server-common/database/queries/upsert-to-topic-and-consumer-group");

const CONSUMER_OFFSETS_TOPIC_NAME = "__consumer_offsets";
const CONSUMER_GROUP = "jcox-420";

setInterval(async () => {
  const knownTopicAndConsumerGroups = await topicsAndConsumerGroups();
  const {
    deletedTopicNames,
    deletedConsumerGroupNames
  } = await checkForDeletedTopicsOrConsumerGroups(knownTopicAndConsumerGroups);

  deleteByTopicName(deletedTopicNames);
  deleteByConsumerGroupName(deletedConsumerGroupNames);
}, seconds(30));

const consumerFrom = async (topicName, consumerGroup) => {
  const { kafkaJs } = accessKafkaConnections();
  const consumer = kafkaJs.client.consumer({
    groupId: consumerGroup
  });
  await consumer.connect();
  await consumer.subscribe({ topic: topicName });
  return consumer;
};

const run = async () => {
  const consumer = await consumerFrom(
    CONSUMER_OFFSETS_TOPIC_NAME,
    CONSUMER_GROUP
  );

  await consumer.run({
    eachBatchAutoResolve: true,
    autoCommitInterval: 500,
    autoCommitThreshold: 500,
    commitOffsetsIfNecessary: true,
    eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning }) => {
      const newTopicAndConsumerGroupRows = [];
      for (const messageIndex in batch.messages) {
        const message = batch.messages[messageIndex];
        const topicAndConsumerGroup = topicAndConsumerGroupDetailsFromMessage(
          message
        );
        if (!topicAndConsumerGroup) continue;
        newTopicAndConsumerGroupRows.push(topicAndConsumerGroup);

        if (messageIndex % 100 === 0) {
          console.log(batch.partition, message.offset);
          await resolveOffset(message.offset);
          await heartbeat();
          console.log("heartbeat");
        }
      }

      const newRowsWithDuplicatesRemoved = uniqBy(
        newTopicAndConsumerGroupRows,
        ({ topicName, consumerGroup }) => topicName + consumerGroup
      );

      for (const newRow of newRowsWithDuplicatesRemoved) {
        await upsertToTopicAndConsumerGroupTable(
          newRow.topicName,
          newRow.consumerGroup.name,
          newRow.consumerGroup.lastActive
        );
      }
    }
  });

  // await consumer.disconnect();
};

run();
