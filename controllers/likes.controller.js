import { 
  toggleLikeService, 
  getArtifactLikesCount,
  checkIfUserLiked,
  getUserLikes 
} from "../services/likes.service.js";

export const toggleLike = async (req, res) => {
  try {
    const result = await toggleLikeService({
      artifactId: req.params.id,
      userId: req.user.id
    });
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getLikesCount = async (req, res) => {
  try {
    const count = await getArtifactLikesCount(req.params.id);
    
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const checkUserLike = async (req, res) => {
  try {
    const liked = await checkIfUserLiked(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      liked
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserLikesController = async (req, res) => {
  try {
    const likes = await getUserLikes(req.user.id);
    
    res.status(200).json({
      success: true,
      count: likes.length,
      likes
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};