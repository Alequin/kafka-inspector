const cloneDeep = require("lodash/cloneDeep");
const Cache = require("cache");
const { seconds } = require("server-common/time-to-milliseconds");

const DEFAULT_OPTIONS = {
  refreshCacheAfter: seconds(30)
};

const isPromise = obj => !!obj.then;
const simpleCache = (func, options = DEFAULT_OPTIONS) => {
  let cache = new Cache(options.refreshCacheAfter);
  return (...args) => {
    const cacheKey = JSON.stringify(args) || "empty-args-key";
    if (!cache.get(cacheKey)) cache.put(cacheKey, func(...args));

    const cachedValue = cache.get(cacheKey);
    return isPromise(cachedValue)
      ? cachedValue.then(cloneDeep)
      : cloneDeep(cachedValue);
  };
};

module.exports = simpleCache;
