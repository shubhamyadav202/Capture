import User from "../models/user.model.js";
import Story from "../models/story.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { io } from "../socket.js";

export const uploadStory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    // Delete any previous stories for this user so only the latest valid story is active
    await Story.deleteMany({ author: req.userId });
    if (user) {
      user.story = null;
    }

    const { mediaType } = req.body;

    let media;

    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Media is Required" });
    }

    if (!media) {
      return res.status(500).json({ message: "Failed to upload media to Cloudinary" });
    }

    const story = await Story.create({
      author: req.userId,
      mediaType: mediaType || "image",
      media,
    });

    user.story = story._id;

    await user.save();

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name username profileImage")
      .populate("viewers", "name username profileImage");

    // Emit real-time new story event
    io.emit("newStory", populatedStory);

    return res.status(200).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: `Story Upload Error ${error}` });
  }
};

export const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(400).json({ message: "story not found" });
    }

    const viewersIds = story.viewers.map((id) => id.toString());

    if (!viewersIds.includes(req.userId.toString())) {
      story.viewers.push(req.userId);
      await story.save();
    }

    const populatedStory = await Story.findById(story._id)
      .populate("author", "name username profileImage")
      .populate("viewers", "name username profileImage");

    return res.status(200).json(populatedStory);
  } catch (error) {
    return res.status(500).json({ message: `Story View Error ${error}` });
  }
};

export const getStoryByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }

    const story = await Story.find({
      author: user._id,
    })
      .populate("viewers author")
      .sort({ createdAt: -1 });

    return res.status(200).json(story);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Story get by username Error ${error}` });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const followingIds = currentUser.following;

    const stories = await Story.find({
      author: { $in: followingIds },
    })
      .populate("viewers author")
      .sort({ createdAt: -1 });

    return res.status(200).json(stories);
  } catch (error) {
    return res.status(500).json({ message: "All story get error" });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const storyAuthor = story.author
      ? (story.author._id || story.author).toString()
      : null;
    const currentUserId = req.userId ? req.userId.toString() : null;

    if (storyAuthor && currentUserId && storyAuthor !== currentUserId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this story" });
    }

    // Clear story from user document
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, { story: null });
    }

    // Delete story document
    await Story.findByIdAndDelete(storyId);

    // Emit socket event for real-time removal across all connected devices
    io.emit("deletedStory", {
      storyId: storyId.toString(),
      authorId: storyAuthor,
    });

    return res.status(200).json({
      message: "Story deleted successfully",
      storyId,
    });
  } catch (error) {
    console.error("deleteStory error:", error);
    return res
      .status(500)
      .json({ message: `deleteStory error : ${error?.message || error}` });
  }
};