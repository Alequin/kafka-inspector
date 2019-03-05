const simpleCache = require("./utils/simple-cache");
const listConsumerGroups = require("./list-consumer-groups");

const listConsumerGroupsWithCache = simpleCache(listConsumerGroups);
module.exports = listConsumerGroupsWithCache;
