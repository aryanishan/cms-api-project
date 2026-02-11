import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.route.js";
import artifactRoutes from "./routes/artifacts.route.js";
import likeRoutes from "./routes/likes.route.js";
import cookieParser from "cookie-parser";
const app = express();

/* Middlewares */
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(cookieParser());

/* Test Route */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CMS Backend is running"
  });
});

/* API Routes */
app.use("/auth", authRoutes);
app.use("/artifacts", artifactRoutes);
app.use("/likes", likeRoutes);

export default app;