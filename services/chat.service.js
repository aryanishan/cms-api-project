export const sendChatService = async ({ senderId, receiverId, message }) => {
    // Minimal in-memory-like persistence placeholder.
    const chat = {
        id: Date.now().toString(),
        senderId,
        receiverId,
        message,
        createdAt: new Date().toISOString(),
    };

    // In a real app: persist to DB here and return saved record.
    return chat;
};

export default {
    sendChatService,
};
