const cloneDeep = require("lodash/cloneDeep");
const { seconds, milliseconds } = require("server-common/time-to-milliseconds");
const selfResettingTimeout = require("./self-resetting-timeout");

const DEFAULT_OPTIONS = {
  refreshCacheAfter: seconds(30)
};

const currentTime = () => new Date();

const prepareShouldRefeshCache = ({ refreshCacheAfter }) => {
  let lastRefreshTime = currentTime();
  return () => {
    const now = currentTime();
    const elapsedTime = now - lastRefreshTime;
    const shouldRefesh = elapsedTime > refreshCacheAfter;
    if (shouldRefesh) lastRefreshTime = now;
    return shouldRefesh;
  };
};

const simpleCache = (func, options = DEFAULT_OPTIONS) => {
  let cache = null;
  const shouldRefeshCache = prepareShouldRefeshCache(options);
  // Added some milliseconds to ensure cache is never returned as null
  const cleaningTimer = selfResettingTimeout(
    options.refreshCacheAfter + milliseconds(500)
  );
  return async (...args) => {
    cleaningTimer(() => {
      cache = null;
    });
    if (!cache || shouldRefeshCache(options)) cache = await func(...args);
    return cloneDeep(cache);
  };
};

module.exports = simpleCache;
