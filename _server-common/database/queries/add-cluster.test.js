const addCluster = require("./add-cluster");
const testDatabaseMigration = require("mock-test-data/test-database-migration");
const runQuery = require("server-common/database/run-query");

describe("addCluster", () => {
  let db = null;

  beforeEach(async () => {
    db = testDatabaseMigration();
    await db.up(Number.MAX_VALUE);
  });

  afterEach(async () => {
    await db.down(Number.MAX_VALUE);
  });

  it("Adds a kafka cluster", async () => {
    await addCluster(["broker1:9092", "broker2:9092", "broker3:9092"]);

    const expected = [
      { id: 1, brokers: "broker1:9092,broker2:9092,broker3:9092" }
    ];
    const actual = await runQuery("SELECT * FROM clusters");
    expect(actual).toEqual(expected);
  });
});
