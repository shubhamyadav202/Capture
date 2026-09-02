import React, { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing, setUserData } from "../redux/userSlice.js";
import axios from "axios";
import { setStoryList } from "../redux/storySlice.js";

const getAllStories = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { storyData } = useSelector((state) => state.story);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/story/getAll`, {
          withCredentials: true,
        });

        dispatch(setStoryList(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchStories();
  }, [userData,storyData]);
};

export default getAllStories;
