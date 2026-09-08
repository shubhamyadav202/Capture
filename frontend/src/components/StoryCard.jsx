import React, { useEffect, useState } from "react";
import dp from "../assets/dp.jpg";
import { useDispatch, useSelector } from "react-redux";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer.jsx";
import { FaEye } from "react-icons/fa6";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import {
  setCurrentUserStory,
  setStoryData,
  setStoryList,
} from "../redux/storySlice.js";
import { setUserData } from "../redux/userSlice.js";

const StoryCard = ({ storyData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showViewers, setShowViewers] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const { storyList } = useSelector((state) => state.story);
  const [progress, setProgress] = useState(0);

  const handleDelete = async () => {
    if (isDeleting || !storyData?._id) return;
    try {
      setIsDeleting(true);
      await axios.delete(`${serverUrl}/api/story/delete/${storyData._id}`, {
        withCredentials: true,
      });

      dispatch(setStoryData(null));
      dispatch(setCurrentUserStory(null));
      if (storyList) {
        dispatch(
          setStoryList(storyList.filter((s) => s._id !== storyData._id)),
        );
      }
      if (userData?.story) {
        dispatch(setUserData({ ...userData, story: null }));
      }
      navigate("/");
    } catch (error) {
      console.log("Delete story error:", error.response?.data || error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (showViewers) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }

        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [navigate, showViewers]);

  return (
    <div className="w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center">
      <div className="w-full flex items-center justify-between absolute px-[15px] top-[30px] z-20">
        <div className="flex items-center gap-[10px]">
          <IoArrowBackSharp
            className="text-white cursor-pointer w-[25px] h-[25px]"
            onClick={() => navigate(`/`)}
          />
          <div
            className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
            onClick={() => navigate(`/getProfile/${storyData?.author?.username}`)}
          >
            <img
              src={storyData?.author?.profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div
            className="w-[120px] font-semibold truncate cursor-pointer text-white "
            onClick={() => navigate(`/getProfile/${storyData?.author?.username}`)}
          >
            {storyData?.author?.username}
          </div>
        </div>

        {(storyData?.author?.username == userData?.username ||
          storyData?.author?._id == userData?._id) && (
          <div>
            {isDeleting ? (
              <ClipLoader size={20} color="#ef4444" />
            ) : (
              <RiDeleteBin5Fill
                className="w-[25px] cursor-pointer h-[25px] text-white hover:text-red-500 transition-all"
                onClick={handleDelete}
              />
            )}
          </div>
        )}
      </div>

      <div className="absolute top-[10px] left-0 w-full h-[5px] bg-gray-900 z-20">
        <div
          className="w-[200px] h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {!showViewers && (
        <>
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

          {(storyData?.author?.username == userData?.username ||
            storyData?.author?._id == userData?._id) && (
              <div
                className="w-full h-[70px] flex items-center gap-[20px] text-white absolute bottom-0 p-2 left-0 cursor-pointer hover:bg-[#ffffff15] transition-all rounded-t-2xl z-20"
                onClick={() => setShowViewers(true)}
              >
                <div className="text-white flex items-center gap-[5px] pl-2 font-medium">
                  <FaEye className="w-[20px] h-[20px]" />
                  <span>{storyData?.viewers?.length || 0}</span>
                </div>
                <div className="flex relative">
                  {storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                    <div
                      key={index}
                      className={`w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${index > 0 ? "absolute" : ""}`}
                      style={index > 0 ? { left: `${index * 25}px` } : {}}
                    >
                      <img
                        src={viewer?.profileImage || dp}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-gray-400 text-sm ml-auto pr-4">Viewers</span>
              </div>
            )}
        </>
      )}

      {showViewers && (
        <div className="w-full h-full flex flex-col justify-between absolute top-0 left-0 bg-black z-30 pt-[70px]">
          <div className="w-full flex items-center justify-between px-[20px] py-[10px]">
            <div className="text-white flex items-center gap-[10px] text-[18px] font-semibold">
              <FaEye />
              <span>{storyData?.viewers?.length || 0} Viewers</span>
            </div>
            <button
              className="text-white text-[14px] font-semibold cursor-pointer px-4 py-1.5 bg-gray-800 rounded-full hover:bg-gray-700 transition-all"
              onClick={() => setShowViewers(false)}
            >
              Back
            </button>
          </div>

          <div className="w-full h-[30%] flex items-center justify-center p-[10px] overflow-hidden">
            {storyData?.mediaType == "image" && (
              <div className="h-full flex items-center justify-center">
                <img
                  src={storyData?.media}
                  alt=""
                  className="h-[90%] rounded-2xl object-cover"
                />
              </div>
            )}

            {storyData?.mediaType == "video" && (
              <div className="h-full flex flex-col items-center justify-center">
                <VideoPlayer media={storyData?.media} />
              </div>
            )}
          </div>

          <div className="w-full h-[60%] border-t-2 border-t-gray-800 p-[20px] overflow-y-auto">
            <h2 className="text-white font-semibold text-[17px] mb-[15px]">
              Viewers List
            </h2>
            <div className="flex flex-col gap-[15px]">
              {storyData?.viewers?.map((viewer, index) => (
                <div
                  key={viewer?._id || index}
                  className="flex items-center gap-[12px] cursor-pointer hover:bg-gray-900 p-2 rounded-xl transition-all"
                  onClick={() => navigate(`/getProfile/${viewer?.username}`)}
                >
                  <div className="w-[45px] h-[45px] rounded-full overflow-hidden border-2 border-gray-700">
                    <img
                      src={viewer?.profileImage || dp}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-[15px]">
                      {viewer?.username}
                    </div>
                    <div className="text-gray-400 text-[13px]">
                      {viewer?.name}
                    </div>
                  </div>
                </div>
              ))}
              {(!storyData?.viewers || storyData.viewers.length === 0) && (
                <div className="text-gray-400 text-center py-8">
                  No viewers yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default StoryCard;
