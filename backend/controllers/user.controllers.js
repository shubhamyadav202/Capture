import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate("posts loops posts.author posts.comments story following");

    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `get current user error ${error}` });
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId },
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get suggested user error ${error}` });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, username, bio, profession, gender } = req.body;

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const sameUserWithUsername = await User.findOne({ username }).select(
      "-password",
    );

    if (sameUserWithUsername && sameUserWithUsername._id != req.userId) {
      return res.status(400).json({ message: "Username Already Exists" });
    }

    let profileImage;

    if (req.file) {
      profileImage = await uploadOnCloudinary(req.file.path);
    }

    user.name = name;
    user.username = username;
    if (profileImage) {
      user.profileImage = profileImage;
    }
    user.bio = bio;
    user.profession = profession;
    user.gender = gender;

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Edit Profile error ${error}` });
  }
};

export const getProfile = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select("-password").populate("posts loops followers following");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Get Profile error ${error}` });
  }
};

export const follow = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const targetUserId = req.params.targetUserId;

    if (!targetUserId) {
      return res.status(400).json({ message: "target user is not Found" });
    }

    if (currentUserId == targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() != targetUserId,
      );

      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() != currentUserId,
      );

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        following: false,
        message: "unfollowed Successfully",
      });
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await currentUser.save();
      await targetUser.save();

      return res.status(200).json({
        following: true,
        message: "followed Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: `Follow error ${error}` });
  }
};
