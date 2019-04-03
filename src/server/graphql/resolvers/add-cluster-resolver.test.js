const { isError } = require("lodash");
const testDatabaseMigration = require("mock-test-data/test-database-migration");
const runQuery = require("server-common/database/run-query");

jest.mock("tcp-ping");
const tcpPing = require("tcp-ping");

const addClusterResolver = require("./add-cluster-resolver");
const mockArgs = {
  name: "cool cluster",
  kafkaBrokers: ["broker1:9092", "broker2:9092", "broker3:9092"]
};

describe("addClusterResolver", () => {
  let db = null;

  beforeEach(async () => {
    db = testDatabaseMigration();
    await db.up();
  });

  afterEach(async () => {
    await db.down();
  });

  it("Stores the new cluster in the database", async () => {
    tcpPing.probe.mockImplementation((_host, _port, callback) => {
      const error = false;
      const hostAndPortAvailable = true;
      callback(error, hostAndPortAvailable);
    });

    await addClusterResolver({}, mockArgs);

    const expected = [
      {
        id: 1,
        name: "cool cluster",
        brokers: "broker1:9092,broker2:9092,broker3:9092"
      }
    ];
    const actual = await runQuery("SELECT * FROM clusters");
    expect(actual).toEqual(expected);
  });

  it("Throws an error if the clusters are badly formatted", done => {
    const badKafkaBrokers = ["bad-broker"];
    addClusterResolver({}, { kafkaBrokers: badKafkaBrokers }).catch(error => {
      expect(isError(error)).toBe(true);
      done();
    });
  });
});
