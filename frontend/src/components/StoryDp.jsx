import dp from "../assets/dp.jpg";
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { useEffect, useState } from "react";

const StoryDp = ({ username, profileImage, story }) => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { storyData,storyList } = useSelector((state) => state.story);
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    if (
      story?.viewers?.some(
        (viewer) =>
          viewer?._id?.toString() === userData._id.toString() ||
          viewer?.toString() == userData._id.toString(),
      )
    ) {
      setViewed(true);
    } else {
      setViewed(false);
    }
    
  }, [story, userData, storyData, storyList]);

  const handleViewers = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/story/view/${story._id}`,
        { withCredentials: true },
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    if (!story && username == "Your Story") {
      navigate("/upload");
    } else if (story && username == "Your Story") {
      handleViewers();
      navigate(`/story/${userData.username}`);
    } else {
      handleViewers();
      navigate(`/story/${username}`);
    }
  };

  return (
    <div className="flex flex-col w-[80px]" onClick={handleClick}>
      <div
        className={`w-[80px] h-[80px] relative ${!story ? null : !viewed ?"bg-gradient-to-b from-blue-500 to-blue-950" : "bg-gradient-to-b from-gray-500 to-black-800"} rounded-full flex justify-center items-center`}
        onClick={handleClick}
      >
        <div className="w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
          <img
            src={profileImage || dp}
            alt=""
            className="w-full object-cover"
          />
          {!story && username == "Your Story" && (
            <div>
              <FiPlusCircle className="text-black w-[22px] h-[22px] bg-white rounded-full absolute bottom-[8px] right-[10px]" />
            </div>
          )}
        </div>
      </div>
      <div className="text-[14px] text-center truncate w-full text-white">
        {username}
      </div>
    </div>
  );
};

export default StoryDp;
