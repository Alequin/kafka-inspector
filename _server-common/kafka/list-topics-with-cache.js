const simpleCache = require("./kafka-utils/simple-cache");
const listTopics = require("./list-topics");

const listTopicsWithCache = simpleCache(listTopics);
module.exports = listTopicsWithCache;
