const simpleCache = require("./utils/simple-cache");
const topic = require("./topic");

const topicsWithCache = simpleCache(topic);
module.exports = topicsWithCache;
