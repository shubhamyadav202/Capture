import React, { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPostData } from "../redux/postSlice.js";

const getAllPosts = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.user)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/post/getAll`, {
          withCredentials: true,
        });

        dispatch(setPostData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [dispatch,userData]);
};

export default getAllPosts;
