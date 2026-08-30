import Loop from "../models/loop.model.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const uploadLoop = async (req, res) => {
  try {
    const { caption } = req.body;

    let media;

    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Media is Required" });
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
    }

    await loop.save();
    await loop.populate("author", "name username profileImage");

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

    await loop.save();

    await loop.populate("author", "name username profileImage");
    await loop.populate("comments.author");
    return res.status(200).json(loop);
  } catch (error) {
    return res.status(500).json({ message: `Comment Loop error : ${error}` });
  }
};

export const getAllLoops = async (req, res) => {
  try {
    const loops = await Loop.find({})
      .populate("author", "name username profileImage")
      .populate("comments.author");
    return res.status(200).json(loops);
  } catch (error) {
    return res.status(500).json({ message: `get All Loop error : ${error}` });
  }
};
