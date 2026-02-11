import express from "express";
import { 
  toggleLike, 
  getLikesCount, 
  checkUserLike,
  getUserLikesController 
} from "../controllers/likes.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route
router.get("/artifact/:id/count", getLikesCount);

// Protected routes
router.use(authenticate);

router.post("/artifact/:id/toggle", toggleLike);
router.get("/artifact/:id/check", checkUserLike);
router.get("/user", getUserLikesController);

export default router;