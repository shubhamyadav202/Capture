import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Home from "./pages/Home.jsx";
import { useDispatch, useSelector } from "react-redux";
import getCurrentUser from "./hooks/getCurrentUser.jsx";
import getSuggestedUsers from "./hooks/getSuggestedUsers.jsx";
import getAllPosts from "./hooks/getAllPosts.jsx";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import Upload from "./pages/Upload.jsx";
import Loops from "./pages/Loops.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import Story from "./pages/Story.jsx";
import getAllLoops from "./hooks/getAllLoops.jsx";
import getAllStories from "./hooks/getAllStories.jsx";
import Messages from "./pages/Messages.jsx";
import MessageArea from "./pages/MessageArea.jsx";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { setOnlineUsers, setSocket } from "./redux/socketSlice.js";
import getFollowingList from "./hooks/getFollowingList.jsx";
import getPrevChatUsers from "./hooks/getPrevChatUsers.jsx";
import Search from "./pages/Search.jsx";
import Notifications from "./components/Notifications.jsx";
import MessageToast from "./components/MessageToast.jsx";
import getAllNotifications from "./hooks/getAllNotifications.jsx";
import { removeStory, addStoryToList, setCurrentUserStory } from "./redux/storySlice.js";
import { setNotificationData, setUserData } from "./redux/userSlice.js";
import { addMessage, moveChatToTop } from "./redux/messageSlice.js";
import axios from "axios";

export const serverUrl =
  import.meta.env.VITE_SERVER_URL || "http://localhost:8080";

function App() {
  getCurrentUser();
  getSuggestedUsers();
  getAllPosts();
  getAllLoops();
  getAllStories();
  getFollowingList();
  getPrevChatUsers();
  getAllNotifications();
  const { userData, notificationData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const { selectedUser, prevChatUsers } = useSelector((state) => state.message);
  const [toastMessage, setToastMessage] = useState(null);
  const dispatch = useDispatch();

  const selectedUserRef = useRef(selectedUser);
  selectedUserRef.current = selectedUser;

  const prevChatUsersRef = useRef(prevChatUsers);
  prevChatUsersRef.current = prevChatUsers;

  useEffect(() => {
    if (userData) {
      const socketIo = io(serverUrl, {
        query: {
          userId: userData._id,
        },
      });
      dispatch(setSocket(socketIo));

      socketIo.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => socketIo.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, [userData]);

  useEffect(() => {
    if (!socket) return;

    const handleDeletedStory = (data) => {
      dispatch(removeStory({ storyId: data.storyId, authorId: data.authorId }));
      if (userData && data.authorId === userData._id?.toString()) {
        dispatch(setUserData({ ...userData, story: null }));
      }
    };

    const handleNewStory = (newStory) => {
      const authorId = (newStory.author?._id || newStory.author)?.toString();
      const currentUserId = userData?._id?.toString();

      if (currentUserId && authorId === currentUserId) {
        dispatch(setCurrentUserStory(newStory));
      } else if (
        userData?.following?.some(
          (f) => (f?._id || f)?.toString() === authorId,
        )
      ) {
        dispatch(addStoryToList(newStory));
      }
    };

    const handleNewNotification = (noti) => {
      dispatch(setNotificationData([...notificationData, noti]));
    };

    const handleNewMessage = (mess) => {
      // Get sender user info from message
      const senderObj =
        typeof mess.sender === "object" && mess.sender !== null
          ? mess.sender
          : mess.senderUser || null;

      const senderId = (
        senderObj?._id ||
        mess.sender ||
        mess.senderUser?._id
      )?.toString();

      if (!senderId) return;

      // Find existing chat in list, if any
      const existingUser = prevChatUsersRef.current?.find(
        (u) => (u._id || u)?.toString() === senderId,
      );

      // Construct clean sender user object
      const senderUser = {
        ...(existingUser || {}),
        ...(senderObj || {}),
        _id: senderId,
        username: senderObj?.username || existingUser?.username || "",
        profileImage: senderObj?.profileImage || existingUser?.profileImage || "",
        name: senderObj?.name || existingUser?.name || "",
      };

      // If user details are still missing, fetch latest chats from server
      if (!senderUser.username) {
        axios
          .get(`${serverUrl}/api/message/prevChats`, { withCredentials: true })
          .then((res) => {
            if (res.data) {
              dispatch(setPrevChatUsers(res.data));
            }
          })
          .catch(() => {});
      }

      const currentSelectedId = (
        selectedUserRef.current?._id || selectedUserRef.current
      )?.toString();

      const isViewingThisChat =
        window.location.pathname === "/messageArea" &&
        currentSelectedId === senderId;

      if (isViewingThisChat) {
        dispatch(addMessage(mess));
        dispatch(
          moveChatToTop({
            user: senderUser,
            message: mess,
            isIncoming: false,
          }),
        );
        axios
          .post(`${serverUrl}/api/message/read/${senderId}`, {}, { withCredentials: true })
          .catch(() => {});
      } else {
        dispatch(
          moveChatToTop({
            user: senderUser,
            message: mess,
            isIncoming: true,
          }),
        );
        setToastMessage({
          senderUser,
          message: mess,
          id: Date.now(),
        });
      }
    };

    socket.on("deletedStory", handleDeletedStory);
    socket.on("newStory", handleNewStory);
    socket.on("newNotification", handleNewNotification);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("deletedStory", handleDeletedStory);
      socket.off("newStory", handleNewStory);
      socket.off("newNotification", handleNewNotification);
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, userData, notificationData, dispatch]);

  return (
    <>
      <MessageToast
        toastData={toastMessage}
        onClose={() => setToastMessage(null)}
      />
      <Routes>
      <Route
        path="/signup"
        element={!userData ? <Signup /> : <Navigate to={"/"} />}
      />
      <Route
        path="/signin"
        element={!userData ? <Signin /> : <Navigate to={"/"} />}
      />
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/forgot-password"
        element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
      />
      <Route
        path="/getProfile/:username"
        element={userData ? <Profile /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/story/:username"
        element={userData ? <Story /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/editprofile"
        element={userData ? <EditProfile /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/messages"
        element={userData ? <Messages /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/upload"
        element={userData ? <Upload /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/loops"
        element={userData ? <Loops /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/loops/:loopId"
        element={userData ? <Loops /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/loop/:loopId"
        element={userData ? <Loops /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/post/:postId"
        element={userData ? <PostDetail /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/messageArea"
        element={userData ? <MessageArea /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/search"
        element={userData ? <Search /> : <Navigate to={"/signin"} />}
      />
      <Route
        path="/notifications"
        element={userData ? <Notifications /> : <Navigate to={"/signin"} />}
      />
    </Routes>
    </>
  );
}

export default App;
