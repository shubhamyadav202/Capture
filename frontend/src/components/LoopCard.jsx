import React, { useEffect, useRef, useState } from "react";
import { FaVolumeHigh } from "react-icons/fa6";
import { IoMdVolumeOff } from "react-icons/io";
import dp from "../assets/dp.jpg";
import FollowButton from "./FollowButton.jsx";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineComment } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { setLoopData } from "../redux/loopSlice.js";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { IoSend, IoClose, IoArrowBackSharp } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ClipLoader } from "react-spinners";
import ShareLoopModal from "./ShareLoopModal.jsx";

const LoopCard = ({ loop, onBack }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef();
  const { socket } = useSelector((state) => state.socket);
  const { userData } = useSelector((state) => state.user);
  const { loopData } = useSelector((state) => state.loop);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [message, setMessage] = useState("");
  const commentRef = useRef();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const isOwnLoop =
    !loop?.author ||
    !loop?.author?.username ||
    (loop?.author?._id || loop?.author)?.toString() === userData?._id?.toString();

  const handleVideoLoaded = () => {
    setIsVideoLoading(false);
    if (isPlaying && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleClick = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleLikeOnDoubleClick = () => {
    setShowHeart(true);
    handleLike();
    setTimeout(() => {
      setShowHeart(false);
    }, 1500);
  };

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`, {
        withCredentials: true,
      });

      const updatedLoop = result.data;
      const updatedLoops = loopData.map((p) =>
        p._id == loop._id ? updatedLoop : p,
      );
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await axios.delete(`${serverUrl}/api/loop/delete/${loop._id}`, {
        withCredentials: true,
      });

      const updatedLoops = loopData.filter((l) => l._id !== loop._id);
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.log("Delete loop error:", error.response?.data || error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleComment = async () => {
    if (!message.trim() || commentLoading) return;
    setCommentLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/loop/comment/${loop._id}`,
        { message },
        {
          withCredentials: true,
        },
      );

      const updatedLoop = result.data;
      const updatedLoops = loopData.map((p) =>
        p._id == loop._id ? updatedLoop : p,
      );
      dispatch(setLoopData(updatedLoops));
      setMessage("");
    } catch (error) {
      console.log(error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId || deletingCommentId) return;
    setDeletingCommentId(commentId);
    try {
      const result = await axios.delete(
        `${serverUrl}/api/loop/comment/${loop._id}/${commentId}`,
        { withCredentials: true },
      );

      const updatedLoops = loopData.map((l) =>
        l._id == loop._id ? { ...l, comments: result.data.comments } : l,
      );
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.log("Delete comment error:", error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (commentRef.current && !commentRef.current.contains(e.target)) {
        setShowComment(false);
      }
    };

    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showComment]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 },
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    socket?.on("likedLoop", (updatedData) => {
      const updatedLoops = loopData.map((p) =>
        p._id == updatedData.loopId ? { ...p, likes: updatedData.likes } : p,
      );
      dispatch(setLoopData(updatedLoops));
    });

    socket?.on("commentedLoop", (updatedData) => {
      const updatedLoops = loopData.map((p) =>
        p._id == updatedData.loopId
          ? { ...p, comments: updatedData.comments }
          : p,
      );
      dispatch(setLoopData(updatedLoops));
    });

    return () => {
      socket?.off("likedLoop");
      socket?.off("commentedLoop");
    };
  }, [socket, loopData, dispatch]);

  return (
    <>
      <div className="w-full h-full overflow-hidden flex items-center justify-center lg:border-x-2 border-gray-900 relative bg-black select-none">
        {showHeart && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50 pointer-events-none">
            <FaHeart className="w-[100px] h-[100px] text-red-600 drop-shadow-2xl" />
          </div>
        )}

        {/* Comments Drawer */}
        <div
          ref={commentRef}
          className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px] rounded-t-4xl bg-[#0e1718] transition-transform duration-500 ease-in-out left-0 shadow-2xl shadow-black ${showComment ? "translate-y-0" : "translate-y-[100%]"}`}
        >
          <div className="relative w-full flex items-center justify-center py-2">
            <h1 className="text-white text-[20px] text-center font-semibold">
              Comments
            </h1>
            <button
              onClick={() => setShowComment(false)}
              className="absolute right-2 text-gray-400 hover:text-white cursor-pointer p-1 rounded-full hover:bg-gray-800 transition-colors"
              title="Close comments"
            >
              <IoClose className="w-[24px] h-[24px]" />
            </button>
          </div>

          <div className="w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]">
            {loop.comments.length == 0 && (
              <div className="text-center text-white text-[20px] font-semibold mt-[50px]">
                No Comments Yet
              </div>
            )}

            {loop.comments?.map((com, index) => {
              const isCommentAuthor =
                (com.author?._id || com.author)?.toString() ===
                userData?._id?.toString();
              const isLoopAuthor =
                (loop.author?._id || loop.author)?.toString() ===
                userData?._id?.toString();
              const canDelete = isCommentAuthor || isLoopAuthor;

              return (
                <div
                  key={com._id || index}
                  className="w-full flex items-center justify-between border-b-[1px] border-gray-800 pb-[10px] mt-[10px] px-[5px]"
                >
                  <div className="flex flex-col gap-[5px] flex-1 min-w-0">
                    <div className="flex justify-start items-center gap-[10px] md:gap-[15px]">
                      <div className="w-[30px] h-[30px] md:w-[36px] md:h-[36px] border-2 border-black rounded-full cursor-pointer overflow-hidden flex-shrink-0">
                        <img
                          src={com.author?.profileImage || dp}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-semibold text-white truncate text-[15px]">
                        {com.author?.username}
                      </div>
                    </div>
                    <div className="text-white pl-[40px] md:pl-[51px] text-[14px] break-words pr-2">
                      {com.message}
                    </div>
                  </div>

                  {canDelete && (
                    <div className="flex-shrink-0 ml-2">
                      {deletingCommentId === com._id ? (
                        <ClipLoader size={16} color="#ef4444" />
                      ) : (
                        <RiDeleteBin5Fill
                          className="w-[18px] h-[18px] text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                          onClick={() => handleDeleteComment(com._id)}
                          title="Delete Comment"
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="w-full absolute bottom-0 left-0 h-[80px] flex items-center justify-between px-[20px] py-[20px] bg-[#0e1718] border-t border-gray-800/60">
            <div className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] border border-gray-700 rounded-full cursor-pointer overflow-hidden shrink-0">
              <img
                src={userData?.profileImage || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              placeholder="Comment...."
              className="px-[12px] border-b-2 placeholder:text-gray-400 text-white border-b-gray-600 focus:border-b-white bg-transparent w-[85%] outline-none h-[40px] text-sm"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleComment();
                }
              }}
            />
            {message.trim() && (
              <button
                disabled={commentLoading}
                className="cursor-pointer disabled:opacity-50 p-2 text-blue-500 hover:text-blue-400 transition-colors"
                onClick={handleComment}
              >
                {commentLoading ? (
                  <ClipLoader size={18} color="white" />
                ) : (
                  <IoSend className="w-[22px] h-[22px]" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Top Header Bar: Back arrow + Loops title on left, Speaker mute/unmute on right - horizontally parallel */}
        <div className="w-full absolute top-0 left-0 z-50 h-[64px] flex items-center justify-between px-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-auto">
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={handleBack}
          >
            <IoArrowBackSharp className="text-white w-6 h-6 group-hover:scale-110 transition-transform drop-shadow-md" />
            <h1 className="text-white text-[20px] font-semibold tracking-wide drop-shadow-md">
              Loops
            </h1>
          </div>

          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors cursor-pointer border border-white/10 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setIsMute((prev) => !prev);
            }}
            title={isMute ? "Unmute" : "Mute"}
          >
            {!isMute ? (
              <FaVolumeHigh className="w-5 h-5 text-white" />
            ) : (
              <IoMdVolumeOff className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        <video
          src={loop?.media}
          ref={videoRef}
          autoPlay
          loop
          muted={isMute}
          playsInline
          preload="auto"
          className="w-full h-full object-cover cursor-pointer"
          onClick={handleClick}
          onTimeUpdate={handleTimeUpdate}
          onDoubleClick={handleLikeOnDoubleClick}
          onLoadedData={handleVideoLoaded}
          onCanPlay={handleVideoLoaded}
          onWaiting={() => setIsVideoLoading(true)}
          onPlaying={() => setIsVideoLoading(false)}
        ></video>

        {isVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="p-4 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-2xl">
              <ClipLoader size={45} color="white" />
            </div>
          </div>
        )}

        {/* Bottom Gradient Overlay for readability */}
        <div className="w-full absolute bottom-0 left-0 h-[260px] bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-20" />

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/20 z-40">
          <div
            className="h-full bg-red-600 transition-all duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Author Details & Caption */}
        <div className="absolute left-0 bottom-7 sm:bottom-9 z-30 pl-4 pr-16 max-w-[78%] sm:max-w-[82%] flex flex-col gap-2.5 pointer-events-auto">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/80 overflow-hidden cursor-pointer shrink-0 shadow-md"
              onClick={() => navigate(`/getProfile/${loop.author?.username}`)}
            >
              <img
                src={loop.author?.profileImage || dp}
                alt={loop.author?.username || "author"}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="font-semibold text-[15px] sm:text-[16px] text-white truncate max-w-[130px] sm:max-w-[160px] cursor-pointer drop-shadow hover:underline"
              onClick={() => navigate(`/getProfile/${loop?.author?.username}`)}
            >
              {loop.author?.username}
            </span>

            {!isOwnLoop && (
              <FollowButton
                targetUserId={loop.author?._id}
                tailwind={
                  "px-3 py-1 text-white border border-white/80 text-[13px] font-medium rounded-full cursor-pointer hover:bg-white/20 transition-all backdrop-blur-xs"
                }
              />
            )}
          </div>

          {loop?.caption && (
            <div className="text-white text-[13.5px] sm:text-[14.5px] leading-snug drop-shadow-md break-words max-h-[85px] overflow-y-auto pr-1 scrollbar-hide select-text">
              {loop.caption}
            </div>
          )}
        </div>

        {/* Action Buttons Sidebar */}
        <div className="absolute right-3 sm:right-4 bottom-8 sm:bottom-10 z-30 flex flex-col items-center gap-4 text-white">
          {/* Like */}
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <button
              type="button"
              onClick={handleLike}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Like loop"
            >
              {!loop.likes?.includes(userData?._id) ? (
                <FaRegHeart className="w-7 h-7 text-white drop-shadow group-hover:scale-110 transition-transform" />
              ) : (
                <FaHeart className="w-7 h-7 text-red-600 drop-shadow group-hover:scale-110 transition-transform" />
              )}
            </button>
            <span className="text-xs font-semibold drop-shadow">{loop.likes?.length || 0}</span>
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <button
              type="button"
              onClick={() => setShowComment(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="View comments"
            >
              <MdOutlineComment className="w-7 h-7 text-white drop-shadow group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-xs font-semibold drop-shadow">{loop.comments?.length || 0}</span>
          </div>

          {/* Delete Loop (if author) */}
          {isOwnLoop && (
            <div className="flex flex-col items-center gap-1 cursor-pointer group">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-red-500/20 transition-colors text-white hover:text-red-500 disabled:opacity-50 cursor-pointer"
                title="Delete loop"
              >
                {isDeleting ? (
                  <ClipLoader size={20} color="#ef4444" />
                ) : (
                  <RiDeleteBin5Fill className="w-6 h-6 text-white drop-shadow group-hover:text-red-500 transition-colors" />
                )}
              </button>
            </div>
          )}

          {/* Share */}
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <button
              type="button"
              onClick={() => setShowShare(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Share loop"
            >
              <FiSend className="w-6 h-6 text-white drop-shadow group-hover:scale-110 group-hover:text-purple-400 transition-all" />
            </button>
          </div>
        </div>
      </div>

      {showShare && (
        <ShareLoopModal
          loopId={loop._id}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
};

export default LoopCard;
