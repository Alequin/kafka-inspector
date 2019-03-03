const { seconds } = require("server-common/time-to-milliseconds");
const simpleCache = require("./kafka-utils/simple-cache");
const listTopics = require("./list-topics");

const listTopicsWithCache = simpleCache(listTopics);
module.exports = listTopicsWithCache;
