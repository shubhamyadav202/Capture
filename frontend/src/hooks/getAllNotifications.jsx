import React, { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPostData } from "../redux/postSlice.js";
import { setNotificationData } from "../redux/userSlice.js";

const getAllNotifications = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/getAllNotifications`,
          {
            withCredentials: true,
          },
        );

        dispatch(setNotificationData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    if (userData) {
      fetchNotifications();
    }
  }, [dispatch, userData]);
};

export default getAllNotifications;
