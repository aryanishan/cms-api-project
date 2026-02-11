import Artifact from "../models/artifact.js";
import { createArtifactService } from "../services/artifact.service.js";

export const createArtifact = async (req, res) => {
  try {
    const artifact = await createArtifactService({
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
      filePath: req.file?.path
    });
    
    res.status(201).json({
      success: true,
      message: "Artifact created successfully",
      artifact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getArtifacts = async (req, res) => {
  try {
    const artifacts = await Artifact.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: artifacts.length,
      artifacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const getArtifactById = async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id)
      .populate("author", "name email");
    
    if (!artifact) {
      return res.status(404).json({
        success: false,
        message: "Artifact not found"
      });
    }
    
    res.status(200).json({
      success: true,
      artifact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const updateArtifact = async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id);
    
    if (!artifact) {
      return res.status(404).json({
        success: false,
        message: "Artifact not found"
      });
    }
    
    // Check if user is the author or admin
    if (artifact.author.toString() !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this artifact"
      });
    }
    
    const updatedArtifact = await Artifact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("author", "name email");
    
    res.status(200).json({
      success: true,
      message: "Artifact updated successfully",
      artifact: updatedArtifact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteArtifact = async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id);
    
    if (!artifact) {
      return res.status(404).json({
        success: false,
        message: "Artifact not found"
      });
    }
    
    // Check if user is the author or admin
    if (artifact.author.toString() !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this artifact"
      });
    }
    
    await artifact.deleteOne();
    
    res.status(200).json({
      success: true,
      message: "Artifact deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};