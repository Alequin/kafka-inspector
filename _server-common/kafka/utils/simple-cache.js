const cloneDeep = require("lodash/cloneDeep");
const Cache = require("cache");
const { seconds } = require("server-common/time-to-milliseconds");

const DEFAULT_OPTIONS = {
  refreshCacheAfter: seconds(30)
};

const simpleCache = (func, options = DEFAULT_OPTIONS) => {
  let cache = new Cache(options.refreshCacheAfter);
  return async (...args) => {
    const cacheKey = JSON.stringify(...args) || "empty-args-key";
    if (!cache.get(cacheKey)) cache.put(cacheKey, func(...args));
    return cloneDeep(await cache.get(cacheKey));
  };
};

module.exports = simpleCache;
