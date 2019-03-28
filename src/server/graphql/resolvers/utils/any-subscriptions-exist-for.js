const anySubscriptionsExistFor = (subscriptionKey, pubSub) => {
  // TODO find a nicer was to do this
  const subscriptions = Object.keys(pubSub.ee._events);
  return subscriptions.includes(subscriptionKey);
};

module.exports = anySubscriptionsExistFor;
