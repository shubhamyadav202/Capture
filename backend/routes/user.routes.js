import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  editProfile,
  follow,
  followingList,
  getAllNotifications,
  getCurrentUser,
  getProfile,
  markAsRead,
  search,
  suggestedUsers,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);

userRouter.get("/suggested", isAuth, suggestedUsers);

userRouter.get("/getProfile/:username", isAuth, getProfile);

userRouter.get("/follow/:targetUserId", isAuth, follow);

userRouter.get("/search", isAuth, search);

userRouter.get("/getAllNotifications", isAuth, getAllNotifications);

userRouter.get("/markAsRead/:notificationId", isAuth, markAsRead);

userRouter.get("/followingList", isAuth, followingList);

userRouter.post(
  "/editProfile",
  isAuth,
  upload.single("profileImage"),
  editProfile,
);

export default userRouter;
