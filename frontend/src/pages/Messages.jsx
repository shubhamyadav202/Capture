import React, { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { BiMessageRoundedDots } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OnlineUser from "../components/OnlineUser.jsx";
import {
  setSelectedUser,
  markChatAsRead,
  setPrevChatUsers,
  removeChatUser,
} from "../redux/messageSlice.js";
import { ClipLoader } from "react-spinners";
import dp from "../assets/dp.jpg";
import axios from "axios";
import { serverUrl } from "../App.jsx";

const Messages = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { prevChatUsers } = useSelector((state) => state.message);
  const [openMenuUserId, setOpenMenuUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuUserId(null);
    };
    if (openMenuUserId) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenuUserId]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/message/prevChats`, {
          withCredentials: true,
        });
        dispatch(setPrevChatUsers(result.data));
      } catch (error) {
        console.log("Error loading chats:", error);
      }
    };
    fetchChats();
  }, []);

  const handleDeleteChat = async (targetUserId) => {
    if (!targetUserId || deletingUserId) return;
    setDeletingUserId(targetUserId);
    try {
      await axios.delete(`${serverUrl}/api/message/deleteChat/${targetUserId}`, {
        withCredentials: true,
      });
      dispatch(removeChatUser(targetUserId));
      setOpenMenuUserId(null);
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setDeletingUserId(null);
    }
  };

  const totalUnread =
    prevChatUsers?.reduce((sum, u) => sum + (u.unreadCount || 0), 0) || 0;

  return (
    <div className="w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[10px]">
      <div className="w-full h-[80px] flex items-center justify-between px-[20px]">
        <div className="flex items-center gap-[20px]">
          <IoArrowBackSharp
            className="text-white lg:hidden cursor-pointer w-[25px] h-[25px]"
            onClick={() => navigate("/")}
          />
          <h1 className="text-white text-[20px] font-semibold">Messages</h1>
        </div>
        {totalUnread > 0 && (
          <div className="px-2.5 py-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-pink-500/20">
            <span>{totalUnread}</span>
            <span className="hidden sm:inline">new</span>
          </div>
        )}
      </div>

      <div className="w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto p-[20px] border-b-2 border-gray-800 ">
        {userData.following?.map(
          (user, index) =>
            onlineUsers?.includes(user._id) && (
              <OnlineUser key={user._id || index} user={user} />
            ),
        )}
      </div>

      <div className="w-full h-full overflow-auto flex flex-col gap-[12px] px-2">
        {!prevChatUsers ? (
          <div className="w-full py-20 flex flex-col items-center gap-3">
            <ClipLoader size={35} color="white" />
            <span className="text-gray-400 text-sm">Loading chats...</span>
          </div>
        ) : prevChatUsers.length === 0 ? (
          <div className="text-gray-400 text-center py-20">No conversations yet</div>
        ) : (
          prevChatUsers.map((user, index) => {
            const hasUnread = (user.unreadCount || 0) > 0;
            const isOnline = onlineUsers?.includes(user._id);

            return (
              <div
                key={user._id || index}
                className={`cursor-pointer w-full flex items-center justify-between p-3 rounded-2xl transition-all ${
                  hasUnread
                    ? "bg-[#181a24] border border-purple-800/50 shadow-lg shadow-purple-950/20"
                    : "hover:bg-gray-900/60"
                }`}
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  dispatch(markChatAsRead(user._id));
                  navigate("/messageArea");
                }}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative flex-shrink-0">
                    <div className="w-[50px] h-[50px] border-2 border-gray-800 rounded-full overflow-hidden">
                      <img
                        src={user.profileImage || dp}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isOnline && (
                      <div className="w-3.5 h-3.5 bg-[#00ff40] border-2 border-black rounded-full absolute bottom-0 right-0"></div>
                    )}
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between pr-2">
                      <span
                        className={`text-[16px] truncate ${
                          hasUnread
                            ? "text-white font-bold"
                            : "text-gray-200 font-semibold"
                        }`}
                      >
                        {user.username || user.name}
                      </span>
                    </div>

                    {hasUnread ? (
                      <span className="text-purple-400 text-[13px] font-medium truncate flex items-center gap-1.5 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping inline-block"></span>
                        New message{user.unreadCount > 1 ? `s (${user.unreadCount})` : ""}
                      </span>
                    ) : user.lastMessage ? (
                      (() => {
                        const isLastVideo =
                          user.lastMessage.mediaType === "video" ||
                          (user.lastMessage.image &&
                            (user.lastMessage.image.includes("/video/upload/") ||
                              user.lastMessage.image.match(/\.(mp4|webm|mov|mkv|avi)($|\?)/i)));
                        return (
                          <span className="text-gray-400 text-[13px] truncate mt-0.5">
                            {user.lastMessage.message ||
                              (isLastVideo
                                ? "🎥 Video"
                                : user.lastMessage.image
                                ? "📷 Photo"
                                : "")}
                          </span>
                        );
                      })()
                    ) : isOnline ? (
                      <span className="text-[#0aff0a] text-[13px] mt-0.5">
                        Active Now
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2 relative">
                  {hasUnread && (
                    <div className="min-w-[20px] h-[20px] px-1.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-pink-500/30">
                      {user.unreadCount > 9 ? "9+" : user.unreadCount}
                    </div>
                  )}

                  <div className="relative">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuUserId(openMenuUserId === user._id ? null : user._id);
                      }}
                      title="Chat options"
                    >
                      <BsThreeDotsVertical className="w-[16px] h-[16px]" />
                    </button>

                    {openMenuUserId === user._id && (
                      <div
                        className="absolute right-0 top-10 z-50 min-w-[145px] bg-[#1a1f26] border border-gray-700/90 rounded-xl shadow-2xl py-1 backdrop-blur-md overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          disabled={deletingUserId === user._id}
                          className="w-full text-left px-3.5 py-2.5 text-[14px] text-red-500 hover:bg-red-500/15 flex items-center gap-2.5 font-medium transition-colors cursor-pointer disabled:opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(user._id);
                          }}
                        >
                          {deletingUserId === user._id ? (
                            <>
                              <ClipLoader size={14} color="#ef4444" />
                              <span>Deleting...</span>
                            </>
                          ) : (
                            <>
                              <RiDeleteBin5Fill className="w-4 h-4 flex-shrink-0" />
                              <span>Delete Chat</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Messages;
