import express from "express";
import { sendChatService } from "../services/chat.service.js";

const router = express.Router();

// Persist a chat message (used by REST clients)
router.post("/send", async (req, res) => {
	try {
		const { senderId, receiverId, message } = req.body || {};
		if (!senderId || !receiverId || !message) {
			return res.status(400).json({ success: false, message: "Missing fields" });
		}

		const saved = await sendChatService({ senderId, receiverId, message });
		return res.status(201).json({ success: true, message: saved });
	} catch (err) {
		console.error("/chats/send error:", err);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

// Get conversation between two users (placeholder — implement DB lookup)
router.get("/conversation/:userA/:userB", async (req, res) => {
	try {
		// In a real app you'd query your messages collection here.
		return res.status(200).json({ success: true, messages: [] });
	} catch (err) {
		console.error("/chats/conversation error:", err);
		return res.status(500).json({ success: false, message: "Internal server error" });
	}
});

export default router;
