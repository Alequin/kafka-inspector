const selfResettingTimeout = timeTillFunctionCall => {
  let cleaningTimeout = null;
  return cleaningCallback => {
    if (cleaningTimeout) clearTimeout(cleaningTimeout);
    cleaningTimeout = setTimeout(cleaningCallback, timeTillFunctionCall);
  };
};

module.exports = selfResettingTimeout;
