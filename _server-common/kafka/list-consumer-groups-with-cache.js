const simpleCache = require("./kafka-utils/simple-cache");
const listConsumerGroups = require("./list-consumer-groups");

const listConsumerGroupsWithCache = simpleCache(listConsumerGroups);
module.exports = listConsumerGroupsWithCache;
