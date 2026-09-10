import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoArrowBackSharp, IoSend, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.jpg";
import { FaRegImage } from "react-icons/fa6";
import { serverUrl } from "../App.jsx";
import {
  setMessages,
  moveChatToTop,
  markChatAsRead,
  setSelectedUser,
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mediaInput = useRef();

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
      <div className="flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 z-[100] bg-black w-full">
        <div className="h-[80px] flex items-center gap-[20px] px-[20px]">
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
