import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { removeMessage } from "../redux/messageSlice.js";
import dp from "../assets/dp.jpg";

const SenderMessage = ({ message }) => {
  const { userData } = useSelector((state) => state.user);
  const scroll = useRef();
  const bubbleRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const pressTimer = useRef(null);
  const isLongPress = useRef(false);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showMenu]);

  const handlePressStart = () => {
    isLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setShowMenu(true);
    }, 450);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleDeleteMessage = async (e) => {
    if (e) e.stopPropagation();
    if (!message?._id || isDeleting) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${serverUrl}/api/message/deleteMessage/${message._id}`, {
        withCredentials: true,
      });
      dispatch(removeMessage(message._id));
    } catch (error) {
      console.error("Delete message error:", error);
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const isVideo =
    message?.mediaType === "video" ||
    (message?.image &&
      (message.image.includes("/video/upload/") ||
        message.image.match(/\.(mp4|webm|mov|mkv|avi)($|\?)/i)));

  const sharedPost = message?.sharedPost;
  const sharedLoop = message?.sharedLoop;

  return (
    <div
      ref={(node) => {
        scroll.current = node;
        bubbleRef.current = node;
      }}
      className={`w-fit max-w-[70%] sm:max-w-[60%] bg-gradient-to-br from-[#9500ff] to-[#ff0095] rounded-t-2xl rounded-bl-2xl rounded-br-0 px-[10px] py-[10px] relative ml-auto right-0 flex flex-col gap-[10px] cursor-pointer select-none transition-all ${
        showMenu ? "ring-2 ring-red-400/90 shadow-xl shadow-red-500/20" : ""
      }`}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setShowMenu((prev) => !prev);
      }}
      onClick={(e) => {
        if (!isLongPress.current) {
          setShowMenu((prev) => !prev);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowMenu(true);
      }}
      title="Click, double click, or hold to delete"
    >
      {/* Delete message popup */}
      {showMenu && (
        <div
          className="absolute -top-12 right-0 z-50 bg-[#1c2128] border border-gray-700/90 rounded-xl shadow-2xl py-1 px-1 backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            disabled={isDeleting}
            className="px-3 py-1.5 text-[13px] text-red-500 hover:bg-red-500/15 rounded-lg flex items-center gap-2 font-medium transition-colors cursor-pointer disabled:opacity-50"
            onClick={handleDeleteMessage}
          >
            {isDeleting ? (
              <>
                <ClipLoader size={13} color="#ef4444" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <RiDeleteBin5Fill className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Delete Message</span>
              </>
            )}
          </button>
        </div>
      )}
      {sharedPost && (
        <div
          className="bg-white/15 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer hover:bg-white/25 transition-all border border-white/20"
          onClick={() => {
            const postId = sharedPost?._id || (typeof sharedPost === "string" ? sharedPost : null);
            if (postId) {
              navigate(`/post/${postId}`);
            }
          }}
        >
          {/* Post author header */}
          <div
            className="flex items-center gap-[8px] px-[10px] py-[8px]"
            onClick={(e) => {
              e.stopPropagation();
              if (sharedPost.author?.username) {
                navigate(`/getProfile/${sharedPost.author.username}`);
              }
            }}
          >
            <div className="w-[28px] h-[28px] rounded-full overflow-hidden border border-white/40 flex-shrink-0">
              <img
                src={sharedPost.author?.profileImage || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-[12px] font-semibold truncate hover:underline">
              {sharedPost.author?.username || "Unknown"}
            </span>
          </div>

          {/* Post media */}
          {sharedPost.media && (
            <div className="w-full max-h-[180px] overflow-hidden">
              {sharedPost.mediaType === "video" ? (
                <div className="w-full h-[120px] bg-black/30 flex items-center justify-center">
                  <span className="text-white/80 text-[12px]">🎬 Video</span>
                </div>
              ) : (
                <img
                  src={sharedPost.media}
                  alt=""
                  className="w-full object-cover max-h-[180px]"
                />
              )}
            </div>
          )}

          {/* Post caption */}
          {sharedPost.caption && (
            <div className="px-[10px] py-[6px]">
              <p className="text-white/90 text-[12px] line-clamp-2">
                {sharedPost.caption}
              </p>
            </div>
          )}
        </div>
      )}

      {sharedLoop && (
        <div
          className="bg-white/15 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer hover:bg-white/25 transition-all border border-white/20"
          onClick={() => {
            const loopId = sharedLoop?._id || (typeof sharedLoop === "string" ? sharedLoop : null);
            if (loopId) {
              navigate(`/loops/${loopId}`);
            }
          }}
        >
          {/* Loop author header */}
          <div
            className="flex items-center gap-[8px] px-[10px] py-[8px]"
            onClick={(e) => {
              e.stopPropagation();
              if (sharedLoop.author?.username) {
                navigate(`/getProfile/${sharedLoop.author.username}`);
              }
            }}
          >
            <div className="w-[28px] h-[28px] rounded-full overflow-hidden border border-white/40 flex-shrink-0">
              <img
                src={sharedLoop.author?.profileImage || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-[12px] font-semibold truncate hover:underline">
              {sharedLoop.author?.username || "Unknown"}
            </span>
          </div>

          {/* Loop video preview */}
          <div className="w-full h-[160px] bg-black/30 overflow-hidden relative">
            <video
              src={sharedLoop.media}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="text-white text-[20px]">🎬</span>
            </div>
          </div>

          {/* Loop caption */}
          {sharedLoop.caption && (
            <div className="px-[10px] py-[6px]">
              <p className="text-white/90 text-[12px] line-clamp-2">
                {sharedLoop.caption}
              </p>
            </div>
          )}
        </div>
      )}

      {message.image && (
        isVideo ? (
          <div className="rounded-2xl overflow-hidden bg-black max-w-full">
            <video
              src={message.image}
              controls
              playsInline
              className="max-h-[280px] w-full rounded-2xl object-contain bg-black"
            />
          </div>
        ) : (
          <img
            src={message.image}
            className="max-h-[250px] object-cover rounded-2xl"
            alt=""
          />
        )
      )}

      {message.message && !sharedPost && !sharedLoop && (
        <div className="text-[18px] text-white break-words">
          {message.message}
        </div>
      )}

      <div className="w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute right-[-25px] bottom-[-40px]">
        <img
          src={userData?.profileImage || dp}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SenderMessage;

