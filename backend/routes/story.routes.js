import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  deleteStory,
  getAllStories,
  getStoryByUsername,
  uploadStory,
  viewStory,
} from "../controllers/story.controllers.js";

const storyRouter = express.Router();

storyRouter.post("/upload", isAuth, upload.single("media"), uploadStory);

storyRouter.get("/getByUsername/:username", isAuth, getStoryByUsername);

storyRouter.get("/getAll", isAuth, getAllStories);

storyRouter.get("/view/:storyId", isAuth, viewStory);

storyRouter.delete("/delete/:storyId", isAuth, deleteStory);

export default storyRouter;
