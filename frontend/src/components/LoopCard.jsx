import React, { useEffect, useRef, useState } from "react";
import { FaVolumeHigh } from "react-icons/fa6";
import { IoMdVolumeOff } from "react-icons/io";
import dp from "../assets/dp.jpg";
import FollowButton from "./FollowButton.jsx";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineComment } from "react-icons/md";
import { FiSend } from "react-icons/fi";
import { setLoopData } from "../redux/loopSlice.js";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { IoSend, IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ClipLoader } from "react-spinners";
import ShareLoopModal from "./ShareLoopModal.jsx";

const LoopCard = ({ loop }) => {
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
    <div className="w-full lg:w-[480px] h-[100vh] overflow-hidden flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative">
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50">
          <FaHeart className="w-[100px] h-[100px] text-red-600 drop-shadow-2xl" />
        </div>
      )}

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

        <div className="w-full fixed bottom-0 h-[80px] flex items-center justify-between px-[20px] py-[20px]">
          <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
            <img
              src={loop.author?.profileImage || dp}
              alt=""
              className="w-full object-cover shrink-0"
            />
          </div>
          <input
            type="text"
            placeholder="Comment...."
            className="px-[10px] border-b-2 placeholder:text-white text-white border-b-gray-500 w-[90%] outline-none h-[40px]"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          {message && (
            <button
              disabled={commentLoading}
              className="absolute right-[20px] cursor-pointer disabled:opacity-50"
              onClick={handleComment}
            >
              {commentLoading ? (
                <ClipLoader size={18} color="white" />
              ) : (
                <IoSend className="w-[25px] text-white h-[25px]" />
              )}
            </button>
          )}
        </div>
      </div>

      <video
        src={loop?.media}
        ref={videoRef}
        autoPlay
        loop
        muted={isMute}
        playsInline
        preload="auto"
        className="w-full max-h-full"
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

      <div
        className="absolute top-[20px] right-[20px] z-[100]"
        onClick={() => setIsMute((prev) => !prev)}
      >
        {!isMute ? (
          <FaVolumeHigh className="w-[20px] h-[20px] text-white font-semibold" />
        ) : (
          <IoMdVolumeOff className="w-[20px] h-[20px] text-white font-semibold" />
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[5px] bg-gray-900">
        <div
          className="w-[200px] h-full bg-[red] transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="w-full absolute h-[100px] bottom-[10px] p-[10px] flex flex-col gap-[10px]">
        <div className="flex items-center gap-[5px]">
          <div
            className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
            onClick={() => navigate(`/getProfile/${loop.author?.username}`)}
          >
            <img
              src={loop.author?.profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div
            className="w-[120px] font-semibold truncate cursor-pointer text-white "
            onClick={() => navigate(`/getProfile/${loop?.author?.username}`)}
          >
            {loop.author?.username}
          </div>


          <FollowButton
            targetUserId={loop.author?._id}
            tailwind={
              "px-[10px] py-[5px] text-white border-2 border-white text-[14px] rounded-2xl cursor-pointer"
            }
          />
        </div>

        <div className="text-white px-[10px]">{loop.caption}</div>

        <div className="absolute right-0 flex flex-col gap-[20px] text-white bottom-[150px] justify-center px-[10px] ">
          <div className="flex flex-col items-center cursor-pointer ">
            <div onClick={handleLike}>
              {!loop.likes.includes(userData._id) && (
                <FaRegHeart className="w-[25px] cursor-pointer h-[25px]" />
              )}
              {loop.likes.includes(userData._id) && (
                <FaHeart className="w-[25px] cursor-pointer h-[25px] text-red-600" />
              )}
            </div>
            <div>{loop.likes.length}</div>
          </div>
          <div className="flex flex-col items-center cursor-pointer">
            <div onClick={() => setShowComment(true)}>
              <MdOutlineComment className="w-[25px] cursor-pointer h-[25px]" />
            </div>
            <div>{loop.comments.length}</div>
            <div className="mt-[10px]">
              {(!loop?.author ||
                !loop?.author?.username ||
                loop?.author?._id == userData?._id ||
                loop?.author == userData?._id) &&
                (isDeleting ? (
                  <ClipLoader size={20} color="#ef4444" />
                ) : (
                  <RiDeleteBin5Fill
                    className="w-[25px] cursor-pointer h-[25px] hover:text-red-500 transition-all"
                    onClick={handleDelete}
                  />
                ))}
            </div>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setShowShare(true)}
          >
            <FiSend className="w-[24px] h-[24px] hover:text-purple-400 transition-colors" />
          </div>

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
