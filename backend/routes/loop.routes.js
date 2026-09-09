import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  uploadLoop,
  getAllLoops,
  like,
  comment,
  deleteComment,
  deleteLoop,
} from "../controllers/loop.controllers.js";

const loopRouter = express.Router();

loopRouter.post("/upload", isAuth, upload.single("media"), uploadLoop);

loopRouter.get("/getAll", isAuth, getAllLoops);

loopRouter.get("/like/:loopId", isAuth, like);

loopRouter.post("/comment/:loopId", isAuth, comment);

loopRouter.delete("/comment/:loopId/:commentId", isAuth, deleteComment);

loopRouter.delete("/delete/:loopId", isAuth, deleteLoop);

export default loopRouter;
