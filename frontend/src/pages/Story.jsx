import React, { useEffect } from "react";
import useParams from "react-router-dom";
import serverUrl from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setStoryData } from "../redux/storySlice.js";
import StoryCard from "../components/StoryCard.jsx";

const Story = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const {storyData} = useSelector(state => state.data);

  const handleStory = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/story/getByUsername/${username}`,
        { withCredentials: true },
      );
      dispatch(setStoryData(result.data));
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
  <div>
    <StoryCard story={storyData}/>
  </div>
  );
};

export default Story;
