import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setStoryData } from "../redux/storySlice.js";
import StoryCard from "../components/StoryCard.jsx";
import axios from "axios";

const Story = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { storyData } = useSelector((state) => state.story);

  const handleStory = async () => {
    dispatch(setStoryData(null)); 
    try {
      const result = await axios.get(
        `${serverUrl}/api/story/getByUsername/${username}`,
        { withCredentials: true },
      );
      dispatch(setStoryData(result.data[0]));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (username) {
      handleStory();
    }
  }, [username]);

  return (
    <div className="w-full h-[100vh] bg-black flex justify-center items-center">
      <StoryCard storyData={storyData} />
    </div>
  );
};

export default Story;
