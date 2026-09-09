import express from "express";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import loopRouter from "./routes/loop.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import postRouter from "./routes/post.routes.js";
import storyRouter from "./routes/story.routes.js";
import messageRouter from "./routes/message.routes.js";
import { app, server } from "./socket.js";
dotenv.config();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/loop", loopRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

server.listen(port, () => {
  connectDb();
  console.log(`Server is Listening on port : ${port}`);
});

