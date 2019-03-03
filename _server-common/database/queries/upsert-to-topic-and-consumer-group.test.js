const testDatabaseMigration = require("../test-database-migration");
const upsertToTopicAndConsumerGroup = require("./upsert-to-topic-and-consumer-group");
const { query } = require("server-common/database/sqlite-connections");

describe("upsertToTopicAndConsumerGroup", () => {
  let db = null;

  beforeEach(async () => {
    db = testDatabaseMigration();
    await db.up(Number.MAX_VALUE);
  });

  afterEach(async () => {
    await db.down(Number.MAX_VALUE);
  });

  it("Can Insert into topicAndConsumerGroup", async () => {
    await upsertToTopicAndConsumerGroup("topic1", "group1", 1234);

    const expected = [
      { topicName: "topic1", consumerGroupName: "group1", lastActive: 1234 }
    ];
    const actual = await query(
      "SELECT topicName, consumerGroupName, lastActive FROM topicsAndConsumerGroups"
    );
    expect(actual).toEqual(expected);
  });

  it("Replaces previous rows if Topic Name and Consumer Group Id match", async () => {
    await upsertToTopicAndConsumerGroup("topic1", "group1", 1234);
    await upsertToTopicAndConsumerGroup("topic1", "group1", 9876);

    const expected = [
      { topicName: "topic1", consumerGroupName: "group1", lastActive: 9876 }
    ];
    const actual = await query(
      "SELECT topicName, consumerGroupName, lastActive FROM topicsAndConsumerGroups"
    );
    expect(actual).toEqual(expected);
  });
});
