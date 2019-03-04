const topicsAndConsumerGroups = require("./topics-and-consumer-groups");
const testDatabaseMigration = require("../test-database-migration");
const runQuery = require("server-common/database/run-query");

describe("topicsAndConsumerGroups", () => {
  let db = null;

  beforeEach(async () => {
    db = testDatabaseMigration();
    await db.up(Number.MAX_VALUE);
  });

  afterEach(async () => {
    await db.down();
  });

  it("Selects all rows from the table topicsAndConsumerGroups", async () => {
    await runQuery(
      "INSERT INTO topicsAndConsumerGroups VALUES (1, 'topic1', 'group1', 123)"
    );

    const expected = [
      {
        id: 1,
        topicName: "topic1",
        consumerGroupName: "group1",
        lastActive: 123
      }
    ];
    const actual = await topicsAndConsumerGroups();
    expect(actual).toEqual(expected);
  });
});
