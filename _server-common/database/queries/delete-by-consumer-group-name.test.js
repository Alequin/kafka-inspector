const deleteByConsumerGroupName = require("./delete-by-consumer-group-name");
const testDatabaseMigration = require("../test-database-migration");
const runQuery = require("server-common/database/run-query");

describe("deleteByConsumerGroupName", () => {
  let db = null;

  beforeEach(async () => {
    db = testDatabaseMigration();
    await db.up(Number.MAX_VALUE);
  });

  afterEach(async () => {
    await db.down(Number.MAX_VALUE);
  });

  it("Deletes all rows with a matching Consumer Group Name", async () => {
    await runQuery(
      "INSERT INTO topicsAndConsumerGroups VALUES (1, 'topic1', 'group1', 123)"
    );

    await deleteByConsumerGroupName(["group1"]);

    const expected = [];
    const actual = await runQuery("SELECT * FROM topicsAndConsumerGroups");

    expect(actual).toEqual(expected);
  });
});
