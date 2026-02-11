import Like from "../models/likes.js";

export const toggleLikeService = async ({ artifactId, userId }) => {
  const existingLike = await Like.findOne({
    artifact: artifactId,
    user: userId
  });

  if (existingLike) {
    // Unlike: remove the like
    await existingLike.deleteOne();
    return { liked: false, message: "Like removed" };
  } else {
    // Like: create new like
    const like = await Like.create({
      artifact: artifactId,
      user: userId
    });
    
    return { liked: true, message: "Liked successfully" };
  }
};

export const getArtifactLikesCount = async (artifactId) => {
  const count = await Like.countDocuments({ artifact: artifactId });
  return count;
};

export const checkIfUserLiked = async (artifactId, userId) => {
  const like = await Like.findOne({
    artifact: artifactId,
    user: userId
  });
  
  return !!like;
};

export const getUserLikes = async (userId) => {
  const likes = await Like.find({ user: userId })
    .populate({
      path: "artifact",
      select: "title author",
      populate: {
        path: "author",
        select: "name"
      }
    });
  
  return likes;
};