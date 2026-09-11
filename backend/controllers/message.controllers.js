import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/messages.model.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Loop from "../models/loop.model.js";
import { io, getSocketId } from "../socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;

    const { message } = req.body;

    let image;
    let mediaType = "image";

    if (req.file) {
      if (req.file.mimetype?.startsWith("video") || req.body.mediaType === "video") {
        mediaType = "video";
      }
      image = await uploadOnCloudinary(req.file.path);
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message,
      image,
      mediaType,
      isRead: false,
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      conversation.updatedAt = new Date();
      await conversation.save();
    }

    // Populate sender info so receiver immediately gets username and profileImage
    const populatedMessage = await Message.findById(newMessage._id).populate(
      "sender",
      "_id name username profileImage"
    );

    const receiverSocketId = getSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    return res.status(200).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ message: `send Messsage error ${error}` });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const otherUserId = req.params.receiverId;

    // Automatically mark unread messages from this sender as read
    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, otherUserId] },
    }).populate({
      path: "messages",
      populate: [
        {
          path: "sender",
          select: "_id name username profileImage",
        },
        {
          path: "sharedPost",
          populate: {
            path: "author",
            select: "_id name username profileImage",
          },
        },
        {
          path: "sharedLoop",
          populate: {
            path: "author",
            select: "_id name username profileImage",
          },
        },
      ],
    });

    return res.status(200).json(conversation?.messages || []);
  } catch (error) {
    return res.status(500).json({ message: `get all messages error ${error}` });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const senderId = req.params.senderId;

    await Message.updateMany(
      { sender: senderId, receiver: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: `mark read error: ${error}` });
  }
};

export const getPrevUserChats = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants", "_id name username profileImage")
      .sort({ updatedAt: -1 });

    const previousUsers = [];
    const seenUserIds = new Set();

    for (const conv of conversations) {
      for (const participant of conv.participants) {
        if (!participant) continue;
        const pId = participant._id.toString();
        if (pId !== currentUserId.toString() && !seenUserIds.has(pId)) {
          seenUserIds.add(pId);

          const unreadCount = await Message.countDocuments({
            sender: participant._id,
            receiver: currentUserId,
            isRead: false,
          });

          const lastMessageId =
            conv.messages && conv.messages.length > 0
              ? conv.messages[conv.messages.length - 1]
              : null;

          let lastMessage = null;
          if (lastMessageId) {
            lastMessage = await Message.findById(lastMessageId).select(
              "message image mediaType sender createdAt isRead"
            );
          }

          const userObj = participant.toObject
            ? participant.toObject()
            : { ...participant };
          userObj.unreadCount = unreadCount;
          userObj.lastMessage = lastMessage;
          previousUsers.push(userObj);
        }
      }
    }

    return res.status(200).json(previousUsers);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get Previous User Chat error ${error}` });
  }
};

export const sharePost = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }

    const post = await Post.findById(postId).populate(
      "author",
      "_id name username profileImage"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: "Shared a post",
      sharedPost: postId,
      isRead: false,
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      conversation.updatedAt = new Date();
      await conversation.save();
    }

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "_id name username profileImage")
      .populate({
        path: "sharedPost",
        populate: {
          path: "author",
          select: "_id name username profileImage",
        },
      });

    const receiverSocketId = getSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    return res.status(200).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ message: `share post error ${error}` });
  }
};

export const shareLoop = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;
    const { loopId } = req.body;

    if (!loopId) {
      return res.status(400).json({ message: "loopId is required" });
    }

    const loop = await Loop.findById(loopId).populate(
      "author",
      "_id name username profileImage"
    );

    if (!loop) {
      return res.status(404).json({ message: "Loop not found" });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: "Shared a loop",
      sharedLoop: loopId,
      isRead: false,
    });

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      conversation.updatedAt = new Date();
      await conversation.save();
    }

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "_id name username profileImage")
      .populate({
        path: "sharedLoop",
        populate: {
          path: "author",
          select: "_id name username profileImage",
        },
      });

    const receiverSocketId = getSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    return res.status(200).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ message: `share loop error ${error}` });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.targetUserId;

    if (!targetUserId) {
      return res.status(400).json({ message: "targetUserId is required" });
    }

    // Find conversation between current user and target user
    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, targetUserId] },
    });

    if (conversation) {
      // Delete all messages referenced in conversation.messages
      if (conversation.messages && conversation.messages.length > 0) {
        await Message.deleteMany({ _id: { $in: conversation.messages } });
      }

      // Also delete any direct messages between these two users
      await Message.deleteMany({
        $or: [
          { sender: currentUserId, receiver: targetUserId },
          { sender: targetUserId, receiver: currentUserId },
        ],
      });

      // Delete the conversation document
      await Conversation.findByIdAndDelete(conversation._id);
    } else {
      // Clean up any direct messages if no conversation document
      await Message.deleteMany({
        $or: [
          { sender: currentUserId, receiver: targetUserId },
          { sender: targetUserId, receiver: currentUserId },
        ],
      });
    }

    // Notify the other user via socket if connected
    const targetSocketId = getSocketId(targetUserId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("deletedChat", {
        deletedBy: currentUserId,
        targetUserId: currentUserId,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
      targetUserId,
    });
  } catch (error) {
    return res.status(500).json({ message: `Delete chat error: ${error?.message || error}` });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({ message: "messageId is required" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const senderId = message.sender ? (message.sender._id || message.sender).toString() : null;
    const receiverId = message.receiver ? (message.receiver._id || message.receiver).toString() : null;
    const currentIdStr = currentUserId.toString();

    // Enforce that only the sender who sent the message can delete it
    if (senderId !== currentIdStr) {
      return res.status(403).json({ message: "You can only delete messages sent by you" });
    }

    // Pull from conversation messages array
    await Conversation.updateMany(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    // Delete the message document
    await Message.findByIdAndDelete(messageId);

    // Notify the receiver via Socket.io if connected
    if (receiverId) {
      const receiverSocketId = getSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("deletedMessage", { messageId });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
      messageId,
    });
  } catch (error) {
    return res.status(500).json({ message: `Delete message error: ${error?.message || error}` });
  }
};


