const simpleCache = require("./utils/simple-cache");
const listTopics = require("./list-topics");

const listTopicsWithCache = simpleCache(listTopics);
module.exports = listTopicsWithCache;
