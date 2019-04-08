const path = require("path");
const { existsSync, writeFileSync, unlinkSync } = require("fs");

const { currentEnvironment } = require("./environment");
const systemId = require("./system-id");

const MOCK_SYSTEM_ID_FILE_PATH = path.resolve(__dirname, "test-system-id.json");

describe("systemId", () => {
  afterEach(() => {
    unlinkSync(MOCK_SYSTEM_ID_FILE_PATH);
  });

  it("Returns the system id (when one exists) in the format <environment>-<id>", () => {
    const mockId = 123;
    writeFileSync(
      MOCK_SYSTEM_ID_FILE_PATH,
      JSON.stringify({ systemId: mockId })
    );

    const expected = `k-inspect-${currentEnvironment}-${mockId}`;
    const actual = systemId(MOCK_SYSTEM_ID_FILE_PATH);
    expect(actual).toBe(expected);
  });

  it("Creates a new system id file if one does not yet exist", () => {
    systemId(MOCK_SYSTEM_ID_FILE_PATH);
    expect(existsSync(MOCK_SYSTEM_ID_FILE_PATH)).toBe(true);
  });
});
