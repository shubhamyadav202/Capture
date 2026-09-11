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
  <b>A modern, feature-packed social networking web application engineered for instant real-time interaction. Built with a scalable MERN stack, bi-directional WebSockets, Cloudinary multimedia processing, 24-hour self-expiring TTL stories, TikTok/Reels-style vertical video streaming, peer-to-peer multimedia chat with post & loop sharing, deep permalinks, and interactive social discovery.</b>
</p>

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Database Design](#-database-schema-design) • [API Reference](#-api-endpoints) • [WebSocket Events](#-websocket-events-socketio) • [Project Structure](#-project-structure) • [Getting Started](#-getting-started) • [Engineering Decisions](#-key-engineering-decisions)

</div>

---

## 📌 Executive Summary

**Capture** is an end-to-end full-stack social media application engineered to deliver the responsive, fluid experience of modern media platforms like Instagram and TikTok. It seamlessly integrates multimedia feed posts, vertical short-form video streaming (**Loops**), automated 24-hour self-destructing **Stories**, real-time peer-to-peer **Direct Messaging** with image and video attachments, in-chat **Post & Loop Sharing**, standalone **Post Permalinks**, deep-linked Loops, live presence indicators, instant activity notifications, and an interactive social graph with follower/following exploration modals.

Built with an emphasis on production-ready architecture, robust security (JWT stored in secure HTTP-only cookies, bcrypt password hashing, and email OTP verification via Nodemailer), and modular state management with Redux Toolkit.

---

## 🌟 Key Features

### 1. 📸 Feed & Multimedia Posts
- **Multi-Format Uploads**: Upload high-resolution images and videos with custom captions via the Cloudinary CDN.
- **Real-Time Likes & Comments**: Instant like/unlike toggling and live comment additions/deletions synchronized across all connected clients via WebSockets.
- **Standalone Post Detail View (`/post/:postId`)**: Dedicated permalink view for every post with server-side hydration, loading skeletons, full comment management, and backward navigation.
- **Direct Post Sharing**: Share any feed post straight into a friend's direct messages via an interactive share modal with user filtering.
- **Bookmarking & Saved Posts**: Save posts to a personal saved collection with a dedicated profile tab.
- **Owner Post Deletion**: Authors can permanently delete their posts with automated cleanup across followers' feeds and saved collections.

### 2. 🎬 "Loops" (Short-Form Reels / Video Engine)
- **TikTok/Reels-style Vertical Feed**: Dedicated vertical video feed with CSS snap-scrolling engineered for seamless short-form entertainment.
- **Deep-Linking & Permalinks (`/loops/:loopId`)**: Shareable direct URLs that instantly load and play a targeted loop at the top of the feed.
- **Rich Interaction Controls**:
  - **Double-Tap to Like**: Animated bursting heart overlay on double click.
  - **Custom Video Scrubber**: Live progress bar tracking playback time.
  - **Smart Buffering**: Visual loading spinner during video buffering.
  - **Audio & Playback Controls**: Click to play/pause, volume mute/unmute toggle.
- **Loop Sharing via DM**: Send any loop directly to followers in direct message chats with rich video preview cards.
- **Comment Moderation & Deletion**: Interactive slide-over comment drawer with delete authorization for both comment authors and loop creators.

### 3. 💬 Real-Time Direct Messaging & Rich Media Sharing
- **Bi-Directional Instant Chat**: 1-on-1 real-time messaging powered by Socket.io.
- **Photos & Native Video Messages**: Send both high-resolution photos and video files directly in chat threads with inline video playback.
- **In-Chat Post & Loop Previews**: Shared posts and loops render interactive preview cards (author avatar, username, media preview, caption) with one-click navigation to the source content.
- **Active Presence Tracking**: Real-time online/offline green indicator based on connected socket mappings.
- **Unread Message Badges & Reordering**: Conversations dynamically sort by the most recent message with live unread count badges.
- **Interactive Message Toasts**: Floating interactive alerts notify users of incoming messages when browsing other pages.
- **Live Media Upload Preview**: Preview selected image or video before sending with single-click removal.

### 4. ⏳ Ephemeral 24-Hour Stories
- **Automated Self-Destruct**: Powered by MongoDB native TTL indexes that automatically purge documents after 24 hours (`expires: 86400`).
- **Live Story Broadcast**: Socket.io (`newStory` and `deletedStory` events) instantly updates connected followers' story bars without requiring a page reload.
- **Viewer Analytics**: Real-time tracking of unique viewers with profile avatars and read indicators.
- **Smooth Auto-Progression**: 5-second progress bar auto-advances or navigates back to feed upon story completion.
- **Manual Early Deletion**: Authors can delete their active story at any time, instantly removing it from all viewers' interfaces.

### 5. 👥 Social Graph & User Discovery
- **Followers & Following Modal (`FollowListModal`)**: Interactive modal directly accessible from profile stat counters featuring:
  - Tabbed switching between Followers and Following lists.
  - Real-time client-side search filtering by name and username.
  - In-modal follow/unfollow toggle with immediate relationship updates.
- **Live Debounced Search**: Instant search querying database profiles by username and full name with a 300ms debounce.
- **Algorithmic User Suggestions**: Suggested user sidebar to discover and connect with creators on the platform.
- **Customizable Profiles**: Edit profile picture, bio, profession, and gender with real-time UI synchronization.

### 6. 🔔 Live Activity Notifications
- **Event-Driven Alerts**: Real-time push notifications for likes, comments, and new followers via WebSockets.
- **Rich Notification Cards**: Displays sender avatar, timestamp, actionable text, and clickable media thumbnails linking directly to posts or loops.
- **Batch Read Marking**: Mark individual or all notifications as read in a single request (`POST /api/user/markAsRead`).
- **Unread Counter Badges**: Real-time badge indicators on the navigation bar.

### 7. 🔐 Authentication & Account Security
- **JWT in HTTP-Only Cookies**: Signed JSON Web Tokens delivered over secure HTTP-only cookies to mitigate XSS and CSRF attacks.
- **Password Salting & Hashing**: Strong password security utilizing `bcryptjs`.
- **OTP-Based Password Reset**: Two-step email verification sending time-limited 6-digit OTP codes via Nodemailer.

---

## 🛠 Tech Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **React 19** | Component-based modern user interface |
| **Build Tool** | **Vite 8** | Ultra-fast HMR and optimized production bundling |
| **State Management** | **Redux Toolkit & React-Redux** | Scalable global state management across 6 modular slices |
| **Styling** | **Tailwind CSS v4** | Modern, responsive, utility-first UI styling with custom themes |
| **Icons & UI Feedback** | **React Icons & React Spinners** | Comprehensive iconography and accessible loading spinners |
| **Routing** | **React Router DOM v7** | Client-side routing with permalinks and protected route guards |
| **Backend Runtime** | **Node.js** | Server-side JavaScript runtime |
| **Backend Framework** | **Express 5** | RESTful routing, middleware handling, and API controllers |
| **Database** | **MongoDB Atlas** | NoSQL document database with native TTL indexes |
| **ODM** | **Mongoose 9** | Schema modeling, relational population, and indexing |
| **Real-Time Engine** | **Socket.io (v4)** | Bi-directional event-based WebSocket communication |
| **Cloud Media Storage** | **Cloudinary** | Cloud-native image and video asset hosting and CDN delivery |
| **File Handling** | **Multer** | Multipart/form-data upload handling with ephemeral disk unlinking |
| **Email Service** | **Nodemailer** | SMTP integration for OTP generation and account recovery |
| **Security** | **JWT & bcryptjs** | Secure authentication cookies and salted password encryption |

---

## 🗄 Database Schema Design

The MongoDB database utilizes 7 interconnected schemas engineered with relational references (`ObjectId` / `ref`) and automated indexing:

| Model | Key Fields | Relationships & Features |
|---|---|---|
| **User** | `name`, `username`, `email`, `password`, `profileImage`, `bio`, `profession`, `gender`, `resetOtp`, `otpExpires` | References arrays of `followers`, `following`, `posts`, `saved`, `loops`, and single `story`. |
| **Post** | `author`, `media`, `mediaType`, `caption`, `likes`, `comments` | `author` refs `User`. `likes` refs `[User]`. `comments` embeds `{ author, message, timestamps }`. |
| **Loop** | `author`, `media`, `caption`, `likes`, `comments` | Optimized for vertical video metadata; refs `User` author, likers array, and embedded comments. |
| **Story** | `author`, `media`, `mediaType`, `viewers`, `createdAt` | **MongoDB TTL Index**: `createdAt` configured with `expires: 86400` for 24h auto-expiry. `viewers` refs `[User]`. |
| **Message** | `sender`, `receiver`, `message`, `image`, `mediaType`, `sharedPost`, `sharedLoop`, `isRead` | Refs `sender` & `receiver` `User`. Embeds `mediaType` (`image` \| `video`), optional refs to `Post` (`sharedPost`) and `Loop` (`sharedLoop`). |
| **Conversation**| `participants`, `messages` | Tracks active 1-on-1 dialogue sessions with sorted message IDs array. |
| **Notification**| `sender`, `receiver`, `type`, `message`, `post`, `loop`, `isRead` | Polymorphic notification model for `like`, `comment`, and `follow` events with target `post` or `loop` references. |

---

## 🔌 API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register a new user and issue secure JWT cookie |
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
| `GET` | `/api/user/getProfile/:username` | Protected | Fetch comprehensive user profile with posts, loops, followers, and following |
| `GET` | `/api/user/follow/:targetUserId` | Protected | Follow or unfollow a targeted user with live notification dispatch |
| `GET` | `/api/user/search?keyword=...` | Protected | Search users by username or full name |
| `GET` | `/api/user/getAllNotifications` | Protected | Fetch all notifications for the authenticated user |
| `POST` | `/api/user/markAsRead` | Protected | Mark single or bulk array of notifications as read |
| `GET` | `/api/user/followingList` | Protected | Fetch following list IDs of the current user |
| `POST` | `/api/user/editProfile` | Protected | Update profile metadata & avatar (Multer + Cloudinary) |

### 📸 Posts Feed (`/api/post`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/post/upload` | Protected | Upload image or video post with caption (Multer + Cloudinary) |
| `GET` | `/api/post/getAll` | Protected | Fetch all chronological posts populated with author and comments |
| `GET` | `/api/post/getPost/:postId` | Protected | Fetch single post by ID (used for permalink `/post/:postId`) |
| `GET` | `/api/post/:postId` | Protected | Alias endpoint to fetch single post by ID |
| `GET` | `/api/post/like/:postId` | Protected | Like / unlike a post and emit real-time socket events |
| `GET` | `/api/post/saved/:postId`| Protected | Bookmark / save a post to user's personal saved collection |
| `POST` | `/api/post/comment/:postId` | Protected | Post a comment on a target post and emit live update |
| `DELETE`| `/api/post/comment/:postId/:commentId` | Protected | Delete a comment (authorized for comment author or post owner) |
| `DELETE`| `/api/post/delete/:postId` | Protected | Permanently delete post and synchronize across client feeds |

### 🎬 Loops / Reels (`/api/loop`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/loop/upload` | Protected | Upload short-form vertical video (Multer + Cloudinary) |
| `GET` | `/api/loop/getAll` | Protected | Fetch all Loops for video feed with integrity sanitization |
| `GET` | `/api/loop/getLoop/:loopId` | Protected | Fetch single Loop by ID (for permalink `/loops/:loopId`) |
| `GET` | `/api/loop/:loopId` | Protected | Alias endpoint to fetch single Loop by ID |
| `GET` | `/api/loop/like/:loopId` | Protected | Like / unlike a specific Loop with live socket broadcast |
| `POST` | `/api/loop/comment/:loopId` | Protected | Add a comment to a Loop |
| `DELETE`| `/api/loop/comment/:loopId/:commentId` | Protected | Delete comment on Loop (authorized for author or loop creator) |
| `DELETE`| `/api/loop/delete/:loopId` | Protected | Permanently delete a Loop and remove from author's profile |

### ⏳ Stories (`/api/story`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/story/upload` | Protected | Upload 24-hour self-destructing story and broadcast live event |
| `GET` | `/api/story/getAll` | Protected | Fetch active stories of followed users |
| `GET` | `/api/story/getByUsername/:username` | Protected | Fetch active story by username |
| `GET` | `/api/story/view/:storyId` | Protected | Mark story as viewed and record viewer ID |
| `DELETE`| `/api/story/delete/:storyId` | Protected | Manually delete story and broadcast instant removal |

### 💬 Real-Time Messaging (`/api/message`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/message/send/:receiverId` | Protected | Send text, photo, or video message with real-time socket delivery |
| `GET` | `/api/message/getAll/:receiverId` | Protected | Fetch conversation history and mark unread messages as read |
| `GET` | `/api/message/prevChats` | Protected | Fetch user's active conversations sorted by latest message with unread count |
| `POST` | `/api/message/read/:senderId` | Protected | Mark incoming messages from sender as read |
| `POST` | `/api/message/share/:receiverId` | Protected | **Share a feed post** directly to a user in chat |
| `POST` | `/api/message/shareLoop/:receiverId`| Protected | **Share a video Loop** directly to a user in chat |

---

## ⚡ WebSocket Events (Socket.io)

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `connection` | Client $\rightarrow$ Server | `userId` query param | Registers socket connection and maps `userId` to `socket.id` |
| `getOnlineUsers` | Server $\rightarrow$ Client | `Array<userId>` | Broadcasts real-time array of active online user IDs |
| `newMessage` | Server $\rightarrow$ Client | `Message` object | Emits incoming message payload (text, media, shared post/loop) |
| `newNotification`| Server $\rightarrow$ Client | `Notification` object | Emits real-time notification alert (like, comment, follow) |
| `newStory` | Server $\rightarrow$ Client | `Story` object | Broadcasts newly posted story to update followers' story bars |
| `deletedStory` | Server $\rightarrow$ Client | `{ storyId, authorId }` | Broadcasts story deletion event to instantly clear UI |
| `likedPost` | Server $\rightarrow$ Client | `{ postId, likes }` | Broadcasts real-time like count changes for posts |
| `commentedPost`| Server $\rightarrow$ Client | `{ postId, comments }` | Broadcasts new comments or deletions on posts |
| `deletedPost` | Server $\rightarrow$ Client | `{ postId }` | Broadcasts post deletion for immediate UI removal |
| `likedLoop` | Server $\rightarrow$ Client | `{ loopId, likes }` | Broadcasts real-time like count changes for loops |
| `commentedLoop`| Server $\rightarrow$ Client | `{ loopId, comments }` | Broadcasts new comments or deletions on loops |
| `deletedLoop` | Server $\rightarrow$ Client | `{ loopId }` | Broadcasts loop deletion for immediate UI removal |
| `disconnect` | Client $\rightarrow$ Server | - | Cleans up user from active socket map and broadcasts update |

---

## 📂 Project Structure

```text
Capture/
├── backend/
│   ├── config/                     # Configuration modules
│   │   ├── cloudinary.js           # Cloudinary SDK & automated temp file unlinking
│   │   ├── db.js                   # Mongoose MongoDB Atlas connection
│   │   ├── mail.js                 # Nodemailer transporter & HTML OTP templates
│   │   └── token.js                # JWT token generation logic
│   ├── controllers/                # Business logic & request handlers
│   │   ├── auth.controllers.js     # Signup, signin, OTP reset, signout
│   │   ├── loop.controllers.js     # Loops CRUD, like, comment, getLoopById
│   │   ├── message.controllers.js  # Messaging, sharePost, shareLoop, read status
│   │   ├── post.controllers.js     # Post CRUD, like, save, comment, getPostById
│   │   ├── story.controllers.js    # Story upload, view, getByUsername, delete
│   │   └── user.controllers.js     # Profile, follow/unfollow, search, notifications
│   ├── middlewares/                # Custom Express middlewares
│   │   ├── isAuth.js               # JWT cookie authentication guard
│   │   └── multer.js               # Multer diskStorage middleware
│   ├── models/                     # Mongoose database models
│   │   ├── conversation.model.js   # 1-on-1 dialogue sessions
│   │   ├── loop.model.js           # Short-form video reels
│   │   ├── messages.model.js       # Messages with media & sharedPost/sharedLoop refs
│   │   ├── notification.model.js   # Polymorphic notifications (post/loop/follow)
│   │   ├── post.model.js           # Feed posts with comments & likes
│   │   ├── story.model.js          # Ephemeral stories with TTL index
│   │   └── user.model.js           # User profiles, auth, & social graph
│   ├── routes/                     # Express API route definitions
│   │   ├── auth.routes.js
│   │   ├── loop.routes.js
│   │   ├── message.routes.js
│   │   ├── post.routes.js
│   │   ├── story.routes.js
│   │   └── user.routes.js
│   ├── index.js                    # Express app bootstrap & HTTP server
│   ├── socket.js                   # Socket.io initialization & user-socket registry
│   └── package.json
│
├── frontend/
│   ├── public/                     # Static public assets
│   ├── src/
│   │   ├── assets/                 # App icons, avatars, and illustrations
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Feed.jsx            # Main feed container with story bar & posts
│   │   │   ├── Post.jsx            # Individual post card with interactions
│   │   │   ├── LoopCard.jsx        # Vertical video card with double-tap like
│   │   │   ├── VideoPlayer.jsx     # HTML5 video player with auto-loop
│   │   │   ├── StoryCard.jsx       # Story viewer modal with progress bar
│   │   │   ├── StoryDp.jsx         # Story avatar bubble with unread status ring
│   │   │   ├── FollowButton.jsx    # Dynamic follow/unfollow action button
│   │   │   ├── FollowListModal.jsx # Followers & Following tabbed exploration modal
│   │   │   ├── SharePostModal.jsx  # Share post directly to followers in chat
│   │   │   ├── ShareLoopModal.jsx  # Share video loop directly to followers in chat
│   │   │   ├── NotificationCard.jsx# Individual rich notification item
│   │   │   ├── Notifications.jsx   # Slide-over / page notification center
│   │   │   ├── MessageToast.jsx    # Floating real-time message notification toast
│   │   │   ├── OnlineUser.jsx      # Active user badge in direct messages
│   │   │   ├── OtherUsers.jsx      # Suggested user recommendation card
│   │   │   ├── ReceiverMessage.jsx # Inbound chat bubble with shared post/loop cards
│   │   │   ├── SenderMessage.jsx   # Outbound chat bubble with shared post/loop cards
│   │   │   ├── LeftHome.jsx        # Desktop left navigation & suggested users
│   │   │   ├── RightHome.jsx       # Desktop right chat sidebar
│   │   │   └── Nav.jsx             # Bottom mobile navigation bar
│   │   ├── hooks/                  # Custom data-fetching & lifecycle hooks
│   │   │   ├── getAllLoops.jsx, getAllNotifications.jsx, getAllPosts.jsx
│   │   │   ├── getAllStories.jsx, getCurrentUser.jsx, getFollowingList.jsx
│   │   │   ├── getPrevChatUsers.jsx, getSuggestedUsers.jsx
│   │   ├── pages/                  # Full page views & routes
│   │   │   ├── Home.jsx            # Responsive desktop 3-column & mobile feed layout
│   │   │   ├── Loops.jsx           # Reels vertical feed with deep-link support
│   │   │   ├── PostDetail.jsx      # Dedicated standalone permalink page for posts
│   │   │   ├── Story.jsx           # Full-screen story playback experience
│   │   │   ├── Upload.jsx          # Multi-tab upload page (post, story, loop)
│   │   │   ├── Messages.jsx        # Active chat threads & online users list
│   │   │   ├── MessageArea.jsx     # 1-on-1 chat area with photo & video sending
│   │   │   ├── Search.jsx          # Live debounced user search page
│   │   │   ├── Profile.jsx         # User profile, posts/saved tabs, follow modal
│   │   │   ├── EditProfile.jsx     # Profile photo & bio/info editor
│   │   │   ├── Signin.jsx          # Authentication login page
│   │   │   ├── Signup.jsx          # User registration page
│   │   │   └── ForgotPassword.jsx  # OTP email verification & password reset
│   │   ├── redux/                  # Redux Toolkit global store & slices
│   │   │   ├── store.js            # Combined root store
│   │   │   ├── userSlice.js        # User session, profile, search & notifications
│   │   │   ├── postSlice.js        # Feed posts cache & updates
│   │   │   ├── loopSlice.js        # Short-form loops cache & updates
│   │   │   ├── storySlice.js       # Ephemeral stories state
│   │   │   ├── messageSlice.js     # Chat conversations, messages & unread counters
│   │   │   └── socketSlice.js      # Socket instance & online user tracking
│   │   ├── App.jsx                 # Route configurations & global socket listeners
│   │   ├── main.jsx                # React root mount with Redux Provider
│   │   └── index.css               # Tailwind CSS v4 design system
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

1. **In-Chat Content Sharing with Rich Polymorphic Previews**:
   - Rather than sending raw hyperlinks that require navigation outside the chat, posts and short-form loops can be directly shared to followers in 1-on-1 DMs. The backend dynamically populates the referenced `Post` or `Loop` document, and the chat UI renders an interactive preview card with media thumbnails, creator avatars, and one-click deep navigation.

2. **Standalone Permalinks & Deep-Linking (`/post/:postId` & `/loops/:loopId`)**:
   - Built dedicated single-item endpoints (`GET /api/post/getPost/:postId` and `GET /api/loop/getLoop/:loopId`) paired with frontend route params. If a user receives a direct URL to a loop or post, the application immediately resolves the content, places it at the top of the feed or displays the post in an isolated view, and preserves back-history navigation.

3. **MongoDB TTL Index for Stories Expiration**:
   - Rather than executing resource-intensive scheduled cron jobs every hour to poll and delete expired stories, the application relies on MongoDB's native Time-To-Live index (`expires: 86400`). The database daemon automatically purges outdated story documents at the storage layer with zero application overhead.

4. **Ephemeral Disk Cleanup for Media Uploads**:
   - Files processed through Multer are saved to a temporary local cache, streamed to Cloudinary, and instantly purged with `fs.unlinkSync` inside a `try/finally` block. This eliminates server storage saturation and prevents memory leaks during concurrent multimedia uploads.

5. **Duplex Real-Time Architecture with Socket.io**:
   - Maintained an in-memory hash map (`userSocketMap`) mapping active `userId`s to their corresponding socket connection IDs. This enables targeted $O(1)$ point-to-point message delivery and targeted event broadcasting (notifications, likes, comments, story updates) without expensive cluster-wide broadcasting.

6. **Interactive Exploration Modals & Debounced Search**:
   - Rather than navigating across separate pages to inspect follower graphs or search results, `FollowListModal` and `Search` provide instant modal and in-line debounced (300ms) query feedback, preserving application context and reducing network thrashing.

7. **Modular Redux Architecture**:
   - Partitioned client state into 6 isolated domains (`user`, `post`, `loop`, `story`, `message`, `socket`). This prevents broad component re-renders, optimizes memory consumption, and enables seamless state synchronization between REST queries and incoming WebSocket payloads.

---

<div align="center">
  <b>Built with ❤️ for scalable, modern social media experiences.</b>
</div>
