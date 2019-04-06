const findClusters = require("./find-clusters");
const testDatabaseMigration = require("mock-test-data/test-database-migration");
const runQuery = require("server-common/database/run-query");

describe("findCluster", () => {
  let db = null;

  beforeEach(async () => {
    db = testDatabaseMigration();
    await db.up(Number.MAX_VALUE);
  });

  afterEach(async () => {
    await db.down(Number.MAX_VALUE);
  });

  it("finds all kafka clusters", async () => {
    await runQuery(`INSERT INTO clusters (name, brokers) VALUES (?,?),(?,?)`, [
      "cluster name 1",
      "broker1:9092,broker2:9092,broker3:9092",
      "cluster name 2",
      "broker4:9092,broker5:9092,broker6:9092"
    ]);

    await findClusters();

    const expected = [
      {
        id: 1,
        name: "cluster name 1",
        brokers: ["broker1:9092", "broker2:9092", "broker3:9092"]
      },
      {
        id: 2,
        name: "cluster name 2",
        brokers: ["broker4:9092", "broker5:9092", "broker6:9092"]
      }
    ];
    const actual = await findClusters();
    expect(actual).toEqual(expected);
  });
});
