<div align="center">

# 📸 Capture — Full-Stack Real-Time Social Media Platform

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

<p align="center">
  <b>A feature-rich, high-performance social networking platform inspired by modern media applications. Built with a scalable MERN stack, bi-directional WebSockets for real-time communication, automated TTL ephemeral stories, Cloudinary media pipeline, and a responsive modern UI.</b>
</p>

[Key Features](#-key-features) • [System Architecture](#-system-architecture) • [Resume Highlights](#-resume-bullet-points-for-cv) • [Tech Stack](#-tech-stack) • [Database Design](#-database-schema-design) • [API Reference](#-api-endpoints) • [Getting Started](#-getting-started)

</div>

---

## 📌 Executive Summary

**Capture** is an end-to-end full-stack social media application engineered to deliver the responsive, dynamic experience of modern platforms like Instagram. It supports multimedia post feeds, vertical short-form video streaming (**Loops**), automated 24-hour self-destructing **Stories**, real-time peer-to-peer **Direct Messaging** with image attachments, live presence tracking, instant event notifications, and a complete social graph with follow/unfollow and user discovery mechanisms.

Built with an emphasis on production-ready architecture, security (JWT stored in secure HTTP-only cookies, bcrypt password hashing, and email OTP verification via Nodemailer), and clean state management (Redux Toolkit with 6 modular slices).

---

## 💼 Resume Bullet Points (For CV / Portfolio)

> *Feel free to copy and adapt these bullet points directly for your resume:*

- **Full-Stack Social Platform Architecture**: Engineered a responsive full-stack social media application (**Capture**) using **React 19, Vite, Node.js, Express 5, and MongoDB Atlas**, supporting 10+ core social features including feed posts, short-form reels, ephemeral stories, and real-time chat.
- **Bi-Directional Real-Time Communication**: Implemented low-latency 1-on-1 private messaging and real-time event broadcasting using **Socket.io**, featuring active user presence tracking, live unread badges, and non-intrusive floating toast notifications for incoming messages.
- **Automated Ephemeral Content Management**: Built an Instagram-style Stories feature utilizing **MongoDB TTL (Time-To-Live) indexing** to automatically expire and purge media records after 24 hours (`86400s`), eliminating manual cron overhead and database bloat.
- **Optimized Cloud Media Pipeline**: Integrated **Multer** and **Cloudinary CDN** for seamless upload, processing, and streaming of high-resolution images and vertical videos (**Loops**), implementing temporary disk storage cleanup (`fs.unlinkSync`) to prevent server memory bloat.
- **Robust Authentication & Recovery**: Implemented secure authentication with **JWT** stored in **HTTP-only, SameSite cookies**, salted password encryption with **bcryptjs**, and an automated 6-digit OTP password reset workflow via **Nodemailer SMTP**.
- **Centralized Global State Management**: Architected global client state using **Redux Toolkit** across 6 specialized slices (`user`, `post`, `loop`, `story`, `message`, `socket`), streamlining asynchronous operations and preventing unnecessary re-renders.

---

## 🌟 Key Features

### 1. 📸 Feed & Multimedia Posts
- **Multi-Format Uploads**: Upload images and videos with custom captions via Cloudinary CDN.
- **Engagement Engine**: Real-time like and unlike toggling with immediate UI reflection.
- **Nested Comments System**: Add and delete comments with author attribution and timestamps.
- **Bookmarking / Saved Posts**: Save posts to a personal saved collection with a dedicated profile tab.

### 2. 🎬 "Loops" (Short-Form Reels / Video Engine)
- **TikTok/Reels-style Experience**: Dedicated vertical video feed engineered for short-form entertainment.
- **Custom Player Controls**: Smooth playback, looping, mute/unmute toggling, and play/pause on click.
- **Social Interaction**: Like and comment directly on Loops with interactive counters.

### 3. ⏳ Ephemeral 24-Hour Stories
- **Automated Self-Destruct**: Powered by MongoDB native TTL indexes that automatically purge documents after 24 hours (`expires: 86400`).
- **Live Story Broadcast**: Uses Socket.io (`newStory` and `deletedStory` events) to instantly update connected followers' story bars without page reload.
- **Viewer Tracking**: Tracks unique viewers with profile avatars and read/viewed indicators.

### 4. 💬 Real-Time Direct Messaging
- **Instant 1-on-1 Chat**: Bi-directional real-time messaging powered by Socket.io.
- **Active Presence**: Real-time online/offline green dot presence indicator based on connected socket mappings.
- **Rich Media Sharing**: Send images directly within chats with automatic Cloudinary storage.
- **Smart Notification Toasts**: Floating interactive toast alerts notify users of incoming messages when browsing other pages.
- **Read Receipts & Reordering**: Dynamically reorders chat conversations to bring recent unread messages to the top.

### 5. 🔔 Live Activity Notifications
- **Event-Driven Alerts**: Real-time notifications for likes, comments, and new followers.
- **Interactive Drawer**: View notification cards with sender avatar, timestamp, and target content link.
- **Unread Status**: Single-click "Mark all as read" with real-time badge count updates.

### 6. 🔐 Authentication & Account Security
- **JWT Authentication**: Signed JSON Web Tokens delivered over secure, HTTP-only cookies to mitigate XSS and CSRF attacks.
- **Password Hashing**: Strong password salting and hashing utilizing `bcryptjs`.
- **OTP-Based Password Reset**: Two-step email verification sending time-limited 6-digit OTP codes via Nodemailer.

### 7. 👥 Social Graph & User Discovery
- **Follow / Unfollow Engine**: Dynamic follower and following lists with mutual relationship tracking.
- **Suggested Users**: Algorithmic suggestion list to discover and connect with other users on the platform.
- **Live Search**: Instant user search querying database profiles by username and full name.
- **Customizable Profiles**: Edit profile picture, bio, profession, and gender with real-time UI synchronization.

---

## 🏗 System Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend (React 19 + Vite + Tailwind CSS v4)"]
        UI[User Interface & Pages]
        Redux[Redux Toolkit Store\nuser | post | loop | story | message | socket]
        SocketClient[Socket.io Client]
        AxiosClient[Axios HTTP Client]
        
        UI -->|Dispatch Actions| Redux
        Redux -->|Select State| UI
        UI -->|User Interactions| AxiosClient
        UI -->|Real-time Subscriptions| SocketClient
    end

    subgraph Server ["Backend (Node.js + Express 5)"]
        Router[Express API Routers\nauth | user | post | loop | story | message]
        AuthMW[isAuth Middleware\nJWT Verification]
        MulterMW[Multer Middleware\nTemp File Uploads]
        SocketServer[Socket.io Server\nConnection & Room Handling]
        
        Router --> AuthMW
        Router --> MulterMW
    end

    subgraph External ["Services & Storage"]
        MongoDb[(MongoDB Atlas\nTTL Indexes, Relational Schema)]
        Cloudinary[(Cloudinary CDN\nMedia Storage & Transformation)]
        Mailer[Nodemailer SMTP\nOTP Email Delivery]
    end

    AxiosClient -->|HTTP REST Requests + Cookies| Router
    SocketClient <-->|Bi-directional WebSockets| SocketServer
    
    MulterMW -->|Stream Media| Cloudinary
    Router -->|Mongoose Queries| MongoDb
    Router -->|Trigger OTP Emails| Mailer
    Router -->|Broadcast Events| SocketServer
    SocketServer -->|Emit Events: newMessage, newNotification, newStory| SocketClient
```

---

## 🛠 Tech Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **React 19** | Component-based modern user interface |
| **Build Tool** | **Vite 8** | Ultra-fast HMR and optimized production bundling |
| **State Management** | **Redux Toolkit & React-Redux** | Scalable global state management across 6 slices |
| **Styling** | **Tailwind CSS v4** | Modern, responsive, utility-first UI styling |
| **Icons & UI Feedback** | **React Icons & React Spinners** | Iconography and accessible loading states |
| **Routing** | **React Router DOM v7** | Client-side routing with protected route guards |
| **Backend Runtime** | **Node.js** | Server-side JavaScript runtime |
| **Backend Framework** | **Express 5** | RESTful routing, middleware handling, and API endpoints |
| **Database** | **MongoDB Atlas** | NoSQL document database with TTL indexes |
| **ODM** | **Mongoose 9** | Schema modeling, validation, and relational population |
| **Real-Time Engine** | **Socket.io (v4)** | Bi-directional event-based WebSocket communication |
| **Cloud Media Storage** | **Cloudinary** | Cloud-native media asset hosting and CDN delivery |
| **File Handling** | **Multer** | Multipart/form-data upload handling with buffer cleanup |
| **Email Service** | **Nodemailer** | SMTP integration for OTP generation and account recovery |
| **Security** | **JWT & bcryptjs** | Secure authentication and password encryption |

---

## 🗄 Database Schema Design

The MongoDB database utilizes 7 interconnected schemas engineered with relational references (`ObjectId` / `ref`) and automated indexing:

| Model | Key Fields | Relationships & Features |
|---|---|---|
| **User** | `name`, `username`, `email`, `password`, `profileImage`, `bio`, `profession`, `gender`, `resetOtp`, `otpExpires` | References arrays of `followers`, `following`, `posts`, `saved`, `loops`, and single `story`. |
| **Post** | `author`, `media`, `mediaType`, `caption`, `likes`, `comments` | `author` refs `User`. `likes` refs `[User]`. `comments` embeds `{ author, message, timestamps }`. |
| **Loop** | `author`, `media`, `caption`, `likes`, `comments` | Optimized for vertical video metadata, refs `User` author and likers. |
| **Story** | `author`, `media`, `mediaType`, `viewers`, `createdAt` | **MongoDB TTL Index**: `createdAt` field configured with `expires: 86400` for 24h auto-expiry. |
| **Message** | `sender`, `receiver`, `message`, `image`, `isRead` | Refs `sender` and `receiver` `User` IDs with boolean read status. |
| **Conversation**| `participants`, `messages` | Tracks active 1-on-1 dialogue sessions with sorted messages history. |
| **Notification**| `sender`, `receiver`, `type`, `message`, `post`, `loop`, `isRead` | Polymorphic notification model for `like`, `comment`, and `follow` events. |

---

## 🔌 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register a new user and issue JWT cookie |
| `POST` | `/api/auth/signin` | Public | Authenticate user credentials and issue JWT cookie |
| `GET` | `/api/auth/signout` | Public | Clear authentication cookie |
| `POST` | `/api/auth/sendOtp` | Public | Generate and email a 6-digit OTP code |
| `POST` | `/api/auth/verifyOtp` | Public | Validate received OTP for password recovery |
| `POST` | `/api/auth/resetPassword`| Public | Set new password upon successful OTP verification |

### 👤 User Management (`/api/user`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/user/current` | Protected | Fetch logged-in user profile with populated refs |
| `GET` | `/api/user/suggested` | Protected | Fetch suggested users to follow |
| `GET` | `/api/user/getProfile/:username` | Protected | Fetch comprehensive user profile by username |
| `GET` | `/api/user/follow/:targetUserId` | Protected | Follow or unfollow a targeted user |
| `GET` | `/api/user/search?query=...` | Protected | Search users by username or full name |
| `POST` | `/api/user/editProfile` | Protected | Update profile metadata & avatar (Multer + Cloudinary) |
| `GET` | `/api/user/getAllNotifications` | Protected | Fetch all user notifications |
| `POST` | `/api/user/markAsRead` | Protected | Mark all unread notifications as read |
| `GET` | `/api/user/followingList` | Protected | Fetch following list of the current user |

### 📸 Posts Feed (`/api/post`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/post/upload` | Protected | Upload media post with caption (Multer + Cloudinary) |
| `GET` | `/api/post/getAll` | Protected | Fetch all chronological posts populated with comments |
| `GET` | `/api/post/like/:postId` | Protected | Like / unlike a post and emit notification |
| `GET` | `/api/post/saved/:postId`| Protected | Bookmark / save a post to user collection |
| `POST` | `/api/post/comment/:postId` | Protected | Post a comment on a target post |
| `DELETE`| `/api/post/comment/:postId/:commentId` | Protected | Remove a comment from a post |
| `DELETE`| `/api/post/delete/:postId` | Protected | Permanently delete post and remove references |

### 🎬 Loops / Reels (`/api/loop`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/loop/upload` | Protected | Upload short-form vertical video |
| `GET` | `/api/loop/getAll` | Protected | Fetch all Loops for video feed |
| `GET` | `/api/loop/like/:loopId` | Protected | Like / unlike a specific Loop |
| `POST` | `/api/loop/comment/:loopId` | Protected | Add a comment to a Loop |
| `DELETE`| `/api/loop/comment/:loopId/:commentId` | Protected | Delete a comment on a Loop |
| `DELETE`| `/api/loop/delete/:loopId` | Protected | Permanently delete a Loop |

### ⏳ Stories (`/api/story`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/story/upload` | Protected | Upload 24-hour self-destructing story |
| `GET` | `/api/story/getAll` | Protected | Fetch active stories of followed users |
| `GET` | `/api/story/getByUsername/:username` | Protected | Fetch active story by username |
| `GET` | `/api/story/view/:storyId` | Protected | Mark story as viewed by current user |
| `DELETE`| `/api/story/delete/:storyId` | Protected | Delete story before 24-hour TTL expiration |

### 💬 Real-Time Messaging (`/api/message`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/message/send/:receiverId` | Protected | Send text/image message and emit real-time socket event |
| `GET` | `/api/message/getAll/:receiverId` | Protected | Fetch all messages exchanged with receiver |
| `GET` | `/api/message/prevChats` | Protected | Fetch user's active conversations list |
| `POST` | `/api/message/read/:senderId` | Protected | Mark messages from sender as read |

---

## ⚡ WebSocket Events (Socket.io)

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `connection` | Client $\rightarrow$ Server | `userId` query param | Registers socket connection and maps `userId` to `socket.id` |
| `getOnlineUsers` | Server $\rightarrow$ Client | `Array<userId>` | Broadcasts real-time array of active online user IDs |
| `newMessage` | Server $\rightarrow$ Client | `Message` object | Emits incoming message payload to receiver socket room |
| `newNotification`| Server $\rightarrow$ Client | `Notification` object | Emits real-time notification alert (like, comment, follow) |
| `newStory` | Server $\rightarrow$ Client | `Story` object | Broadcasts newly posted story to connected users |
| `deletedStory` | Server $\rightarrow$ Client | `{ storyId, authorId }` | Broadcasts story deletion event to instantly clear UI |
| `disconnect` | Client $\rightarrow$ Server | - | Cleans up user from active socket map and broadcasts update |

---

## 📂 Project Structure

```text
Capture/
├── backend/
│   ├── config/             # Configuration modules
│   │   ├── cloudinary.js   # Cloudinary SDK & automated temp file unlinking
│   │   ├── db.js           # Mongoose MongoDB Atlas connection
│   │   ├── mail.js         # Nodemailer transporter & HTML OTP templates
│   │   └── token.js        # JWT token generation logic
│   ├── controllers/        # Business logic & request handlers
│   │   ├── auth.controllers.js
│   │   ├── loop.controllers.js
│   │   ├── message.controllers.js
│   │   ├── post.controllers.js
│   │   ├── story.controllers.js
│   │   └── user.controllers.js
│   ├── middlewares/        # Custom Express middlewares
│   │   ├── isAuth.js       # JWT cookie authentication guard
│   │   └── multer.js       # Multer diskStorage middleware
│   ├── models/             # Mongoose database models
│   │   ├── conversation.model.js
│   │   ├── loop.model.js
│   │   ├── messages.model.js
│   │   ├── notification.model.js
│   │   ├── post.model.js
│   │   ├── story.model.js
│   │   └── user.model.js
│   ├── routes/             # Express API routes
│   ├── index.js            # Express app bootstrap & HTTP server
│   ├── socket.js           # Socket.io initialization & user-socket registry
│   └── package.json
│
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # App icons and illustrations
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Feed.jsx, Post.jsx, LoopCard.jsx, VideoPlayer.jsx
│   │   │   ├── StoryCard.jsx, StoryDp.jsx, FollowButton.jsx
│   │   │   ├── Notifications.jsx, MessageToast.jsx, OnlineUser.jsx
│   │   │   └── SenderMessage.jsx, ReceiverMessage.jsx, Nav.jsx
│   │   ├── hooks/          # Custom data-fetching & lifecycle hooks
│   │   ├── pages/          # Full page views
│   │   │   ├── Home.jsx, Loops.jsx, Story.jsx, Upload.jsx
│   │   │   ├── Messages.jsx, MessageArea.jsx, Search.jsx
│   │   │   ├── Profile.jsx, EditProfile.jsx
│   │   │   └── Signin.jsx, Signup.jsx, ForgotPassword.jsx
│   │   ├── redux/          # Redux Toolkit global store & slices
│   │   │   ├── store.js
│   │   │   ├── userSlice.js, postSlice.js, loopSlice.js
│   │   │   ├── storySlice.js, messageSlice.js, socketSlice.js
│   │   ├── App.jsx         # App router & global socket event listeners
│   │   ├── main.jsx        # React root mount with Redux Provider
│   │   └── index.css       # Tailwind CSS v4 design system
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MongoDB Atlas](https://www.mongodb.com/) cluster URI or local MongoDB instance
- [Cloudinary](https://cloudinary.com/) free account for media storage
- Gmail account with [App Password](https://support.google.com/accounts/answer/185833) (for Nodemailer OTP emails)

---

### 1. Clone the Repository
```bash
git clone https://github.com/shubhamyadav202/Capture.git
cd Capture
```

---

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your environment variables in `backend/.env`:
   ```env
   PORT=8080
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/CAPTURE?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   EMAIL=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server should run on `http://localhost:8080`.*

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `frontend/`:
   ```bash
   cp .env.example .env
   ```
4. Configure your backend URL in `frontend/.env`:
   ```env
   VITE_SERVER_URL=http://localhost:8080
   ```
5. Start the Vite development server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:5173`.

---

## 💡 Key Engineering Decisions

1. **MongoDB TTL Index for Stories Expiration**:
   - Rather than executing resource-intensive scheduled cron jobs every hour to poll and delete expired stories, the application relies on MongoDB's native Time-To-Live index (`expires: 86400`). The database daemon automatically purges outdated story documents at the storage layer with zero application overhead.

2. **Ephemeral Disk Cleanup for Media Uploads**:
   - Files processed through Multer are saved to a temporary local cache, streamed to Cloudinary, and instantly purged with `fs.unlinkSync` inside a `try/finally` block. This eliminates server storage saturation and prevents memory leaks during concurrent uploads.

3. **Duplex Real-Time Architecture with Socket.io**:
   - Maintained an in-memory hash map (`userSocketMap`) mapping active `userId`s to their corresponding socket connection IDs. This enables targeted $O(1)$ point-to-point message delivery and targeted event broadcasting (notifications, likes, stories) rather than expensive cluster-wide broadcasting.

4. **Modular Redux Slices**:
   - Partitioned client state into 6 isolated domains (`user`, `post`, `loop`, `story`, `message`, `socket`). This prevents broad component re-renders, optimizes memory consumption, and allows predictable state synchronization between REST queries and incoming WebSocket payloads.

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).

---

<div align="center">
  <b>Built with ❤️ by Shubham Yadav</b><br>
  <i>Show some star ⭐️ love if you found this project helpful!</i>
</div>