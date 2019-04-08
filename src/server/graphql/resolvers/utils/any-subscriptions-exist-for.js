const anySubscriptionsExistFor = (subscriptionKey, pubSub) => {
  // TODO find a nicer way to do this
  const subscriptions = Object.keys(pubSub.ee._events);
  return subscriptions.includes(subscriptionKey);
};

module.exports = anySubscriptionsExistFor;
