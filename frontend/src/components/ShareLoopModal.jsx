import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import { IoCheckmarkCircle } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { setSelectedUser } from "../redux/messageSlice.js";
import dp from "../assets/dp.jpg";

const ShareLoopModal = ({ loopId, onClose }) => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sendingTo, setSendingTo] = useState(null);
  const [sentTo, setSentTo] = useState([]);

  const followingUsers = userData?.following || [];

  const filteredUsers = followingUsers.filter((user) => {
    if (!user || typeof user !== "object") return false;
    const keyword = search.toLowerCase();
    return (
      user.username?.toLowerCase().includes(keyword) ||
      user.name?.toLowerCase().includes(keyword)
    );
  });

  const handleShare = async (receiverId) => {
    if (sendingTo || sentTo.includes(receiverId)) return;
    setSendingTo(receiverId);
    try {
      await axios.post(
        `${serverUrl}/api/message/shareLoop/${receiverId}`,
        { loopId },
        { withCredentials: true }
      );
      setSentTo((prev) => [...prev, receiverId]);
      // Find the user object and redirect to chat
      const receiverUser = followingUsers.find(
        (u) => u._id?.toString() === receiverId
      );
      if (receiverUser) {
        dispatch(setSelectedUser(receiverUser));
        onClose();
        navigate("/messageArea");
      }
    } catch (error) {
      console.log("Share loop error:", error);
    } finally {
      setSendingTo(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-[420px] bg-[#1a1f1f] rounded-2xl shadow-2xl overflow-hidden border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[20px] py-[15px] border-b border-gray-700">
          <h2 className="text-[18px] font-bold text-white">Share Loop</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <IoClose className="w-[24px] h-[24px] text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="px-[20px] py-[12px] border-b border-gray-800">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-[14px] py-[10px] bg-gray-800 rounded-xl text-[14px] text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* User List */}
        <div className="max-h-[350px] overflow-auto">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[40px] text-gray-500">
              <FiSend className="w-[32px] h-[32px] mb-[10px]" />
              <span className="text-[14px]">
                {search ? "No users found" : "You're not following anyone yet"}
              </span>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const userId = user._id?.toString();
              const isSent = sentTo.includes(userId);
              const isSending = sendingTo === userId;

              return (
                <div
                  key={userId}
                  className="flex items-center justify-between px-[20px] py-[12px] hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-[12px] flex-1 min-w-0">
                    <div className="w-[44px] h-[44px] rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0">
                      <img
                        src={user.profileImage || dp}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-[14px] text-white truncate">
                        {user.username}
                      </span>
                      <span className="text-[12px] text-gray-400 truncate">
                        {user.name}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleShare(userId)}
                    disabled={isSending || isSent}
                    className={`px-[16px] py-[8px] rounded-xl text-[13px] font-semibold cursor-pointer transition-all flex items-center gap-[6px] ${
                      isSent
                        ? "bg-green-900/40 text-green-400"
                        : "bg-gradient-to-r from-[#9500ff] to-[#ff0095] text-white hover:shadow-lg hover:scale-105"
                    } disabled:cursor-not-allowed`}
                  >
                    {isSending ? (
                      <ClipLoader size={14} color="white" />
                    ) : isSent ? (
                      <>
                        <IoCheckmarkCircle className="w-[16px] h-[16px]" />
                        Sent
                      </>
                    ) : (
                      <>
                        <FiSend className="w-[14px] h-[14px]" />
                        Send
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareLoopModal;
