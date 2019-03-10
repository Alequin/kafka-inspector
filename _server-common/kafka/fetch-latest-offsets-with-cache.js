const { seconds } = require("server-common/time-to-milliseconds");
const simpleCache = require("./utils/simple-cache");
const fetchLatestOffsets = require("./fetch-latest-offsets");

module.exports = simpleCache(fetchLatestOffsets, {
  refreshCacheAfter: seconds(5)
});
