function normalizeMessages(messages) {
  let parsedMessages;
  if (Array.isArray(messages)) {
    parsedMessages = messages.map((message) => ({
      id: message.id,
      user: message.user,
      text: message.text,
      time: message.createdAt,
    }));
  } else if (typeof messages === 'object') {
    parsedMessages = {
      id: messages.id,
      user: messages.user,
      text: messages.text,
      time: messages.createdAt,
    };
  } else {
    throw new Error(`Messages must be of type object or array, recieved a ${typeof messages}`);
  }
  return parsedMessages;
}

module.exports = normalizeMessages;
