import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { registerSocketHandlers } from "./sockets/socket.js";

const PORT = process.env.PORT || 8080;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const server = http.createServer(app);
const io = new server(server, {
  cors: {
    origin : "*",
    credentials: true
  }
});

registerSocketHandlers