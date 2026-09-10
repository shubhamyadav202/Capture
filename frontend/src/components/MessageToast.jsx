import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedUser, markChatAsRead } from "../redux/messageSlice";
import dp from "../assets/dp.jpg";
import { IoClose } from "react-icons/io5";
import { BiMessageRoundedDots } from "react-icons/bi";

const MessageToast = ({ toastData, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!toastData) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toastData, onClose]);

  if (!toastData) return null;

  const { senderUser, message } = toastData;

  const isVideo =
    message?.mediaType === "video" ||
    (message?.image &&
      (message.image.includes("/video/upload/") ||
        message.image.match(/\.(mp4|webm|mov|mkv|avi)($|\?)/i)));

  const previewText =
    message?.message ||
    (isVideo ? "🎥 Sent a video" : message?.image ? "📷 Sent a photo" : "New message");

  const handleClick = () => {
    if (senderUser) {
      dispatch(setSelectedUser(senderUser));
      dispatch(markChatAsRead(senderUser._id));
      onClose();
      navigate("/messageArea");
    }
  };

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] w-[92%] max-w-[420px] transition-all duration-300 ease-out animate-bounce-short">
      <div
        onClick={handleClick}
        className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#171725]/95 to-[#1c142b]/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-950/50 cursor-pointer hover:border-purple-400/70 transition-all group"
      >
        <div className="relative flex-shrink-0">
          <div className="w-[45px] h-[45px] rounded-full overflow-hidden border-2 border-purple-500/60 group-hover:scale-105 transition-all">
            <img
              src={senderUser?.profileImage || dp}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-br from-pink-500 to-purple-600 absolute -bottom-1 -right-1 flex items-center justify-center shadow-md">
            <BiMessageRoundedDots className="text-white w-[11px] h-[11px]" />
          </div>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm font-bold truncate">
              {senderUser?.username || senderUser?.name || "New Message"}
            </span>
            <span className="text-[11px] text-purple-400 font-medium">just now</span>
          </div>
          <p className="text-gray-300 text-xs truncate mt-0.5 group-hover:text-white transition-colors">
            {previewText}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <IoClose className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageToast;
