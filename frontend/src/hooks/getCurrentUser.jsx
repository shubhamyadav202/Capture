import React, { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setFollowing, setUserData } from "../redux/userSlice.js";
import axios from "axios";

const getCurrentUser = () => {
  const dispatch = useDispatch();
  const { storyData } = useSelector((state) => state.story);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });

        dispatch(setUserData(result.data));
        dispatch(setFollowing(result.data.following));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [storyData]);
};

export default getCurrentUser;
