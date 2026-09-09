import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.jpg";
import FollowButton from "./FollowButton.jsx";

const FollowListModal = ({
  isOpen,
  onClose,
  initialTab = "followers",
  followers = [],
  following = [],
  currentUserId,
  onFollowChange,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setActiveTab(initialTab);
    setSearchTerm("");
  }, [initialTab, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validFollowers = followers.filter(Boolean);
  const validFollowing = following.filter(Boolean);

  const currentList =
    activeTab === "followers" ? validFollowers : validFollowing;

  const filteredList = currentList.filter((user) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const username = user?.username?.toLowerCase() || "";
    const name = user?.name?.toLowerCase() || "";
    return username.includes(term) || name.includes(term);
  });

  const handleUserClick = (username) => {
    if (username) {
      onClose();
      navigate(`/getProfile/${username}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] bg-[#121719] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Tabs & Close Button */}
        <div className="w-full flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-800">
          <div className="flex gap-6">
            <button
              onClick={() => {
                setActiveTab("followers");
                setSearchTerm("");
              }}
              className={`text-[16px] md:text-[17px] font-semibold pb-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "followers"
                  ? "text-white border-white"
                  : "text-gray-400 border-transparent hover:text-gray-200"
              }`}
            >
              Followers ({validFollowers.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("following");
                setSearchTerm("");
              }}
              className={`text-[16px] md:text-[17px] font-semibold pb-2 border-b-2 transition-all cursor-pointer ${
                activeTab === "following"
                  ? "text-white border-white"
                  : "text-gray-400 border-transparent hover:text-gray-200"
              }`}
            >
              Followings ({validFollowing.length})
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer p-1.5 rounded-full hover:bg-gray-800 transition-colors"
            title="Close"
          >
            <IoClose className="w-[22px] h-[22px]" />
          </button>
        </div>

        {/* Optional Search Filter */}
        {currentList.length > 4 && (
          <div className="px-4 pt-3 pb-1">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1b2326] border border-gray-700 rounded-xl px-3 py-1.5 text-sm text-white placeholder-gray-400 outline-none focus:border-gray-500 transition"
            />
          </div>
        )}

        {/* Users List */}
        <div className="w-full overflow-y-auto p-4 flex flex-col gap-2 min-h-[200px] max-h-[420px]">
          {filteredList.length === 0 ? (
            <div className="w-full py-16 flex flex-col items-center justify-center text-gray-400 text-center">
              <span className="text-[15px]">
                {searchTerm
                  ? "No matching users found"
                  : activeTab === "followers"
                    ? "No followers yet"
                    : "Not following anyone yet"}
              </span>
            </div>
          ) : (
            filteredList.map((user, index) => {
              const userId = user._id || user;
              const username = user.username;
              const name = user.name;
              const profileImg = user.profileImage || dp;
              const isCurrentUser =
                currentUserId?.toString() === userId?.toString();

              return (
                <div
                  key={userId || index}
                  className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 mr-3"
                    onClick={() => handleUserClick(username)}
                  >
                    <div className="w-[45px] h-[45px] rounded-full border border-gray-700 overflow-hidden shrink-0">
                      <img
                        src={profileImg}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-white text-[15px] truncate hover:underline">
                        {username || "User"}
                      </span>
                      {name && (
                        <span className="text-gray-400 text-[13px] truncate">
                          {name}
                        </span>
                      )}
                    </div>
                  </div>

                  {!isCurrentUser && (
                    <FollowButton
                      targetUserId={userId}
                      tailwind="px-4 py-1.5 text-[13px] font-semibold rounded-xl bg-white text-black hover:bg-gray-200 transition cursor-pointer shrink-0"
                      onFollowChange={onFollowChange}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
