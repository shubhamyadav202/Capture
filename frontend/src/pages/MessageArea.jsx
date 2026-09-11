import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoArrowBackSharp, IoSend, IoClose } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.jpg";
import { FaRegImage } from "react-icons/fa6";
import { serverUrl } from "../App.jsx";
import {
  setMessages,
  moveChatToTop,
  markChatAsRead,
  setSelectedUser,
  removeChatUser,
} from "../redux/messageSlice.js";
import SenderMessage from "../components/SenderMessage.jsx";
import ReceiverMessage from "../components/ReceiverMessage.jsx";
import { ClipLoader } from "react-spinners";
import axios from "axios";

const MessageArea = () => {
  const { selectedUser, messages } = useSelector((state) => state.message);
  const { userData } = useSelector((state) => state.user);
  const [input, setInput] = useState("");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deletingChat, setDeletingChat] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mediaInput = useRef();

  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenu(false);
    };
    if (showMenu) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  const handleDeleteChat = async () => {
    if (!selectedUser?._id || deletingChat) return;
    setDeletingChat(true);
    try {
      await axios.delete(`${serverUrl}/api/message/deleteChat/${selectedUser._id}`, {
        withCredentials: true,
      });
      dispatch(removeChatUser(selectedUser._id));
      dispatch(setSelectedUser(null));
      dispatch(setMessages([]));
      navigate("/messages");
    } catch (error) {
      console.error("Delete chat error:", error);
    } finally {
      setDeletingChat(false);
      setShowMenu(false);
    }
  };

  const handleMedia = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackendMedia(file);
    setFrontendMedia(URL.createObjectURL(file));
    setIsVideo(file.type.startsWith("video"));
  };

  const handleClearMedia = () => {
    setFrontendMedia(null);
    setBackendMedia(null);
    setIsVideo(false);
    if (mediaInput.current) {
      mediaInput.current.value = "";
    }
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser?._id || (!input.trim() && !backendMedia) || sending) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("message", input);

      if (backendMedia) {
        formData.append("image", backendMedia);
        formData.append("mediaType", isVideo ? "video" : "image");
      }

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true },
      );

      dispatch(setMessages([...messages, result.data]));
      dispatch(
        moveChatToTop({
          user: selectedUser,
          message: result.data,
          isIncoming: false,
        }),
      );
      setInput("");
      handleClearMedia();
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setSending(false);
    }
  };

  const getAllMessages = async () => {
    if (!selectedUser?._id) return;
    setLoadingMessages(true);
    try {
      const result = await axios.get(
        `${serverUrl}/api/message/getAll/${selectedUser._id}`,
        { withCredentials: true },
      );

      dispatch(setMessages(result.data));
      dispatch(markChatAsRead(selectedUser._id));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    getAllMessages();
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="bg-black relative w-full h-[100vh]">
      <div className="flex items-center justify-between px-[20px] py-[10px] fixed top-0 z-[100] bg-black w-full border-b border-gray-900/60">
        <div className="flex items-center gap-[15px]">
          <div className="h-[80px] flex items-center gap-[20px]">
            <IoArrowBackSharp
              className="text-white cursor-pointer w-[25px] h-[25px]"
              onClick={() => {
                dispatch(setSelectedUser(null));
                navigate(`/`);
              }}
            />
          </div>

          <div
            className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
            onClick={() => navigate(`/getProfile/${selectedUser?.username}`)}
          >
            <img
              src={selectedUser?.profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>

          <div className="text-white text-[18px] font-semibold">
            <div className="cursor-pointer">{selectedUser?.name}</div>
            <div className="text-[14px] cursor-pointer text-gray-400">
              {selectedUser?.username}
            </div>
          </div>
        </div>

        {/* Options menu */}
        <div className="relative pr-2">
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            title="Chat options"
          >
            <BsThreeDotsVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-11 z-50 min-w-[150px] bg-[#1a1f26] border border-gray-700/90 rounded-xl shadow-2xl py-1 overflow-hidden backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                disabled={deletingChat}
                className="w-full text-left px-3.5 py-2.5 text-[14px] text-red-500 hover:bg-red-500/15 flex items-center gap-2.5 font-medium transition-colors cursor-pointer disabled:opacity-50"
                onClick={handleDeleteChat}
              >
                {deletingChat ? (
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

      <div className="w-full h-[80%] pt-[100px] px-[40px] flex flex-col gap-[50px] overflow-auto bg-black">
        {loadingMessages ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <ClipLoader size={35} color="white" />
            <span className="text-gray-400 text-sm">Loading messages...</span>
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((mess, index) => {
            const isSender =
              (mess.sender?._id || mess.sender)?.toString() ===
              userData?._id?.toString();

            return isSender ? (
              <SenderMessage key={mess._id || index} message={mess} />
            ) : (
              <ReceiverMessage key={mess._id || index} message={mess} />
            );
          })
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            No messages yet. Say hello!
          </div>
        )}
      </div>

      <div className="w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-black z-[100]">
        <form
          className="w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#131616] flex items-center gap-[10px] px-[20px] relative"
          onSubmit={handleSubmitMessage}
        >
          {frontendMedia && (
            <div className="w-[120px] h-[120px] rounded-2xl absolute top-[-140px] right-[10px] overflow-hidden border-2 border-purple-500 bg-black shadow-2xl relative group">
              {isVideo ? (
                <video
                  src={frontendMedia}
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={frontendMedia}
                  className="h-full w-full object-cover"
                  alt=""
                />
              )}
              <button
                type="button"
                onClick={handleClearMedia}
                className="absolute top-1 right-1 bg-black/80 hover:bg-red-600 text-white rounded-full p-1 transition-all cursor-pointer shadow-md"
                title="Remove attachment"
              >
                <IoClose size={16} />
              </button>
              {isVideo && (
                <span className="absolute bottom-1.5 left-1.5 bg-black/75 text-[10px] font-semibold text-white px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/20">
                  Video
                </span>
              )}
            </div>
          )}

          <input
            type="file"
            accept="image/*,video/*"
            hidden
            ref={mediaInput}
            onChange={handleMedia}
          />

          <input
            type="text"
            placeholder="Message"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className="w-full h-full px-[20px] text-[18px] text-white outline-0"
          />

          <div>
            <FaRegImage
              className="w-[28px] h-[28px] mt-[6px] cursor-pointer text-white hover:text-gray-300 transition-all"
              onClick={() => mediaInput.current?.click()}
              title="Attach photo or video"
            />
          </div>

          {(input || frontendMedia) && (
            <button
              type="submit"
              disabled={sending}
              className="w-[60px] h-[40px] cursor-pointer rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center disabled:opacity-50"
            >
              {sending ? (
                <ClipLoader size={18} color="white" />
              ) : (
                <IoSend className="w-[25px] h-[25px] text-white" />
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default MessageArea;
