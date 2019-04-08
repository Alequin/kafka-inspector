const path = require("path");
const uuid = require("uuid/v4");
const { existsSync, readFileSync, writeFileSync } = require("fs");
const { currentEnvironment } = require("./environment");

const DEFAULT_SYSTEM_ID_FILE_PATH = path.resolve(__dirname, "system-id.json");

const readSystemFile = filePath => JSON.parse(readFileSync(filePath));

const createSystemIdFile = filePath =>
  writeFileSync(filePath, JSON.stringify({ systemId: uuid() }));

const isSystemIdFileMissing = filePath => !existsSync(filePath);

// The system id is an identifier for the current running instance of k-inspect
// It is used for things like consumer group ids to ensure two users running
// k-inspect separately dont end up with the same consumer group ids
const systemId = (systemIdFilePath = DEFAULT_SYSTEM_ID_FILE_PATH) => {
  if (isSystemIdFileMissing(systemIdFilePath))
    createSystemIdFile(systemIdFilePath);

  const systemIdFileContents = readSystemFile(systemIdFilePath);
  return `k-inspect-${currentEnvironment}-${systemIdFileContents.systemId}`;
};

module.exports = systemId;
