import Artifact from "../models/artifact.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

export const createArtifactService = async ({ title, content, userId, filePath }) => {
  let mediaUrl = null;
  
  if (filePath) {
    try {
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: "cms-artifacts"
      });
      
      mediaUrl = uploadResult.secure_url;
      
      // Delete local file after upload
      fs.unlinkSync(filePath);
    } catch (error) {
      // Clean up file even if upload fails
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  const artifact = await Artifact.create({
    title,
    content,
    author: userId,
    media: mediaUrl || null
  });

  return await artifact.populate("author", "name email");
};

export const updateArtifactService = async (artifactId, updates, userId, userRole) => {
  const artifact = await Artifact.findById(artifactId);
  
  if (!artifact) {
    throw new Error("Artifact not found");
  }
  
  // Check ownership
  if (artifact.author.toString() !== userId && userRole !== "ADMIN") {
    throw new Error("Not authorized to update this artifact");
  }
  
  // Handle file upload if present
  if (updates.filePath) {
    try {
      const uploadResult = await cloudinary.uploader.upload(updates.filePath, {
        folder: "cms-artifacts"
      });
      
      updates.media = uploadResult.secure_url;
      
      // Delete local file
      fs.unlinkSync(updates.filePath);
      delete updates.filePath;
    } catch (error) {
      if (fs.existsSync(updates.filePath)) {
        fs.unlinkSync(updates.filePath);
      }
      throw new Error(`File upload failed: ${error.message}`);
    }
  }
  
  const updatedArtifact = await Artifact.findByIdAndUpdate(
    artifactId,
    updates,
    { new: true, runValidators: true }
  ).populate("author", "name email");
  
  return updatedArtifact;
};