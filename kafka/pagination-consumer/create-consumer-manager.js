const createMessageManager = maxOffset => {
  if (!maxOffset)
    throw new Error(
      "For pagination to work a max offset is required. Please provide one"
    );
  const messages = [];
  return message => {
    const shouldCloseConsumer = message.offset > maxOffset;
    !shouldCloseConsumer && messages.push(message);
    return { shouldCloseConsumer: shouldCloseConsumer, messages };
  };
};

module.exports = createMessageManager;
