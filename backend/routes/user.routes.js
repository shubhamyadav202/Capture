import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  editProfile,
  follow,
  followingList,
  getCurrentUser,
  getProfile,
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

userRouter.get("/followingList", isAuth, followingList);

userRouter.post(
  "/editProfile",
  isAuth,
  upload.single("profileImage"),
  editProfile,
);

export default userRouter;
