import { sendChatService } from "../services/chat.service.js";

export const registerSocketHandlers = (io) => {
    const onlineUsers = new Map();

    io.on("connection", (socket) => {
        console.log("User connected: ", socket.id);

        socket.on("user-online", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log("Online Users: ", onlineUsers);
        });

        socket.on("send-message", async ({ data }) => {
            try {
                const { senderId, receiverId, message } = data || {};

                if (!senderId || !receiverId || !message) {
                    socket.emit("message-error", { error: "Invalid payload" });
                    return;
                }

                const saved = await sendChatService({ senderId, receiverId, message });

                // Acknowledge sender with saved message
                socket.emit("message-sent", { message: saved });

                // If receiver is online, forward the message
                const receiverSocketId = onlineUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive-message", { message: saved });
                }
            } catch (err) {
                console.error("send-message error:", err);
                socket.emit("message-error", { error: "Internal server error" });
            }
        });

        socket.on("disconnect", () => {
            // Clean up any entries that referenced this socket id
            for (const [userId, sockId] of onlineUsers.entries()) {
                if (sockId === socket.id) onlineUsers.delete(userId);
            }
            console.log("User disconnected: ", socket.id);
        });
    });
};