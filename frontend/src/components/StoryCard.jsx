import React, { useEffect, useState } from "react";
import dp from "../assets/dp.jpg";
import { useSelector } from "react-redux";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const StoryCard = () => {
  const navigate = useNavigate();
  const { storyData } = useSelector((state) => state.story);
  const [progress,setProgress] = useState(0);

  useEffect(()=>{
    const interval = setInterval(()=>{
      setProgress(prev => {
        if(prev >= 100)
        {
          clearInterval(interval);
          navigate("/")
          return 100;
        }

        return prev + 1})
    },150)

    return () => clearInterval(interval)
  },[navigate]);



  return (
    <div className="w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center">
      <div className="flex items-center gap-[10px] absolute px-[10px] top-[30px]">
        <IoArrowBackSharp
          className="text-white cursor-pointer w-[25px] h-[25px]"
          onClick={() => navigate(`/`)}
        />
        <div
          className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
          // onClick={() => navigate(`/getProfile/${story.author?.username}`)}
        >
          <img
            src={storyData?.author?.profileImage || dp}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div
          className="w-[120px] font-semibold truncate cursor-pointer text-white "
          // onClick={() => navigate(`/getProfile/${story?.author?.username}`)}
        >
          {storyData?.author?.username}
        </div>
      </div>

      <div className="w-full h-[90vh] flex items-center justify-center">
        {storyData?.mediaType == "image" && (
          <div className="w-[90%] flex items-center justify-center">
            <img
              src={storyData?.media}
              alt=""
              className="w-[80%] rounded-2xl object-cover"
            />
          </div>
        )}

        {storyData?.mediaType == "video" && (
          <div className="w-[80%] flex flex-col items-center justify-center">
            <VideoPlayer media={storyData?.media} />
          </div>
        )}
      </div>

      <div className="absolute top-[10px] left-0 w-full h-[5px] bg-gray-900">
        <div
          className="w-[200px] h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StoryCard;
