import express from "express";
import { 
  createArtifact, 
  getArtifacts, 
  getArtifactById,
  updateArtifact,
  deleteArtifact 
} from "../controllers/artifact.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { upload } from "../middleware/uploads.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getArtifacts);
router.get("/:id", getArtifactById);

// Protected routes (require authentication)
router.use(authenticate);

// Create artifact (EDITOR or ADMIN only)
router.post(
  "/",
  authorizeRoles("EDITOR", "ADMIN"),
  upload.single("media"),
  createArtifact
);

// Update artifact
router.put(
  "/:id",
  upload.single("media"),
  updateArtifact
);

// Delete artifact
router.delete("/:id", deleteArtifact);

export default router;