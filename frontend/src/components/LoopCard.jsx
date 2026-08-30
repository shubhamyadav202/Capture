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
import { setLoopData } from "../redux/loopSlice.js";
import axios from "axios";
import { serverUrl } from "../App.jsx";

const LoopCard = ({ loop }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const videoRef = useRef();
  const { userData } = useSelector((state) => state.user);
  const { loopData } = useSelector((state) => state.loop);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const handleClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleLikeOnDoubleClick = () => {
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 6000);
    {
      !loop.likes?.includes(userData._id) ? handleLike() : null;
    }
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

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/loop/comment/${post._id}`,
        { message },
        {
          withCredentials: true,
        },
      );

      const updatedLoop = result.data;
      const updatedLoops = loopData.map((p) =>
        p._id == post._id ? updatedLoop : p,
      );
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.log(error);
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (entry.isIntersecting) {
          video.play();
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

  return (
    <div className="w-full lg:w-[480px] h-[100vh] overflow-hidden flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative">

      {showHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50">
          <FaHeart className="w-[100px] h-[100px] text-red-600 drop-shadow-2xl" />
        </div>
      )}

      <div className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px] rounded-t-4xl bg-[#0e1718] transition-transform duration-500 ease-in-out left-0 shadow-2xl shadow-black ${showComment ? "translate-y-0" : "translate-y-[100%]"}`}>
      <h1 className="text-white text-[20px] text-center font-semibold ">Comments</h1>
      </div>


      <video
        src={loop?.media}
        ref={videoRef}
        autoPlay
        loop
        muted={isMute}
        className="w-full max-h-full"
        onClick={handleClick}
        onTimeUpdate={handleTimeUpdate}
        onDoubleClick={handleLikeOnDoubleClick}
      ></video>

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
            onClick={() => navigate(`/getProfile/${loop.author?.username}`)}
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
          <div className="flex flex-col items-center cursor-pointer ">
            <div onClick={()=>setShowComment(true)}>
              <MdOutlineComment className="w-[25px] cursor-pointer h-[25px]" />
            </div>
            <div>{loop.comments.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoopCard;
