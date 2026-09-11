import Loop from "../models/loop.model.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import { io, getSocketId } from "../socket.js";

export const uploadLoop = async (req, res) => {
  try {
    const { caption } = req.body;

    let media;

    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Media is Required" });
    }

    if (!media) {
      return res
        .status(500)
        .json({ message: "Cloudinary upload failed: No media returned" });
    }

    const loop = await Loop.create({
      caption,
      media,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    user.loops.push(loop._id);
    await user.save();

    const populatedLoop = await Loop.findById(loop._id).populate(
      "author",
      "name username profileImage",
    );

    return res.status(200).json(populatedLoop);
  } catch (error) {
    res.status(500).json({ message: `uploadLoop error ${error}` });
  }
};

export const like = async (req, res) => {
  try {
    const loopId = req.params.loopId;
    const loop = await Loop.findById(loopId);

    if (!loop) {
      return res.status(400).json({ message: "loop not found" });
    }

    const alreadyLiked = loop.likes.some(
      (id) => id.toString() == req.userId.toString(),
    );

    if (alreadyLiked) {
      loop.likes = loop.likes.filter(
        (id) => id.toString() != req.userId.toString(),
      );
    } else {
      loop.likes.push(req.userId);

      if (loop.author._id != req.userId) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: loop.author._id,
          type: "like",
          loop: loop._id,
          message: "Liked your loop",
        });

        const populatedNotification = await Notification.findById(
          notification._id,
        ).populate("sender receiver loop");

        const receiverSocketId = getSocketId(loop.author._id);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newNotification",
            populatedNotification,
          );
        }
      }
    }

    await loop.save();
    await loop.populate("author", "name username profileImage");

    io.emit("likedLoop", {
      loopId: loop._id,
      likes: loop.likes,
    });

    return res.status(200).json(loop);
  } catch (error) {
    return res.status(500).json({ message: `like Loop error : ${error}` });
  }
};

export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const loopId = req.params.loopId;

    const loop = await Loop.findById(loopId);

    if (!loop) {
      return res.status(400).json({ message: "loop not found" });
    }

    loop.comments.push({
      author: req.userId,
      message,
    });

    if (loop.author._id != req.userId) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: loop.author._id,
        type: "comment",
        loop: loop._id,
        message: "Commented on your loop",
      });

      const populatedNotification = await Notification.findById(
        notification._id,
      ).populate("sender receiver loop");

      const receiverSocketId = getSocketId(loop.author._id);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }

    await loop.save();

    await loop.populate("author", "name username profileImage");
    await loop.populate("comments.author");

    io.emit("commentedLoop", {
      loopId: loop._id,
      comments: loop.comments,
    });

    return res.status(200).json(loop);
  } catch (error) {
    return res.status(500).json({ message: `Comment Loop error : ${error}` });
  }
};

export const getAllLoops = async (req, res) => {
  try {
    const loops = await Loop.find({})
      .populate("author", "name username profileImage")
      .populate("comments.author")
      .sort({ createdAt: -1 });

    const validLoops = [];
    for (const loop of loops) {
      const isBlank =
        !loop.author ||
        !loop.author.username ||
        !loop.media ||
        loop.media === "undefined" ||
        loop.media.trim() === "";

      if (isBlank) {
        await Loop.findByIdAndDelete(loop._id);
        await User.updateMany(
          { loops: loop._id },
          { $pull: { loops: loop._id } },
        );
        await Notification.deleteMany({ loop: loop._id });
      } else {
        validLoops.push(loop);
      }
    }

    return res.status(200).json(validLoops);
  } catch (error) {
    return res.status(500).json({ message: `get All Loop error : ${error}` });
  }
};

export const deleteLoop = async (req, res) => {
  try {
    const loopId = req.params.loopId;
    const loop = await Loop.findById(loopId);

    if (!loop) {
      return res.status(404).json({ message: "Loop not found" });
    }

    const loopAuthor = loop.author
      ? (loop.author._id || loop.author).toString()
      : null;
    const currentUserId = req.userId ? req.userId.toString() : null;

    if (loopAuthor && currentUserId && loopAuthor !== currentUserId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this loop" });
    }

    // Remove loop from author's loops array
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, {
        $pull: { loops: loopId },
      });
    }

    // Remove notifications related to this loop
    await Notification.deleteMany({ loop: loopId });

    // Delete loop document
    await Loop.findByIdAndDelete(loopId);

    // Emit real-time socket event
    io.emit("deletedLoop", { loopId });

    return res.status(200).json({
      message: "Loop deleted successfully",
      loopId,
    });
  } catch (error) {
    console.error("deleteLoop error:", error);
    return res
      .status(500)
      .json({ message: `deleteLoop error : ${error?.message || error}` });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { loopId, commentId } = req.params;
    const currentUserId = req.userId;

    const loop = await Loop.findById(loopId);
    if (!loop) {
      return res.status(404).json({ message: "Loop not found" });
    }

    const commentIndex = loop.comments.findIndex(
      (c) => c._id.toString() === commentId,
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const targetComment = loop.comments[commentIndex];

    const isCommentAuthor =
      targetComment.author.toString() === currentUserId.toString();
    const isLoopAuthor =
      loop.author.toString() === currentUserId.toString();

    if (!isCommentAuthor && !isLoopAuthor) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    loop.comments.splice(commentIndex, 1);
    await loop.save();

    await loop.populate("author", "name username profileImage");
    await loop.populate("comments.author", "name username profileImage");

    io.emit("commentedLoop", {
      loopId: loop._id,
      comments: loop.comments,
    });

    return res.status(200).json({
      message: "Comment deleted successfully",
      comments: loop.comments,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Delete comment error : ${error?.message || error}` });
  }
};

export const getLoopById = async (req, res) => {
  try {
    const { loopId } = req.params;
    const loop = await Loop.findById(loopId)
      .populate("author", "name username profileImage profession bio")
      .populate("comments.author", "name username profileImage");

    if (!loop) {
      return res.status(404).json({ message: "Loop not found" });
    }

    return res.status(200).json(loop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getLoopById error: ${error?.message || error}` });
  }
};

