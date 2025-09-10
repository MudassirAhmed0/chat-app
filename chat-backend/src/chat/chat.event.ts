export const topicMessageAdded = (conversationId: string) =>
  `messageAdded:${conversationId}`;
export const topicMessageUpdated = (conversationId: string) =>
  `messageUpdated:${conversationId}`;
export const topicTypingStarted = (conversationId: string) =>
  `typingStarted:${conversationId}`;
