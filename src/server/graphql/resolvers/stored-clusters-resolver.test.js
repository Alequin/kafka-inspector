const testDatabaseMigration = require("mock-test-data/test-database-migration");
const runQuery = require("server-common/database/run-query");

const storedClusterResolver = require("./stored-clusters-resolver");

describe.skip("storedClusterResolver", () => {
  let db = null;

  beforeEach(async () => {
    db = testDatabaseMigration();
    await db.up();
  });

  afterEach(async () => {
    await db.down();
  });

  it("Should return all the stored clusters with the brokers as an array", async () => {
    const mockClusterName1 = "cluster name 1";
    const mockBrokers1 = "broker1,broker2,broker3";
    const mockClusterName2 = "cluster name 1";
    const mockBrokers2 = "broker4,broker5,broker6";

    await runQuery("INSERT INTO clusters (name, brokers) VALUES (?,?),(?,?)", [
      mockClusterName1,
      mockBrokers1,
      mockClusterName2,
      mockBrokers2
    ]);

    const expected = [
      {
        id: 1,
        name: mockClusterName1,
        brokers: ["broker1", "broker2", "broker3"]
      },
      {
        id: 2,
        name: mockClusterName2,
        brokers: ["broker4", "broker5", "broker6"]
      }
    ];
    const actual = await storedClusterResolver();
    expect(actual).toEqual(expected);
  });
});
