import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {getAllMessages, getPrevUserChats, sendMessage, markAsRead, sharePost, shareLoop, deleteChat, deleteMessage} from "../controllers/message.controllers.js"

const messageRouter = express.Router();

messageRouter.post("/send/:receiverId", isAuth, upload.single("image"), sendMessage);

messageRouter.get("/getAll/:receiverId", isAuth, getAllMessages);

messageRouter.get("/prevChats", isAuth, getPrevUserChats);

messageRouter.post("/read/:senderId", isAuth, markAsRead);

messageRouter.post("/share/:receiverId", isAuth, sharePost);

messageRouter.post("/shareLoop/:receiverId", isAuth, shareLoop);

messageRouter.delete("/deleteChat/:targetUserId", isAuth, deleteChat);

messageRouter.delete("/deleteMessage/:messageId", isAuth, deleteMessage);

export default messageRouter;
