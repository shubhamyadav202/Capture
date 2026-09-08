import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import NotificationCard from "./NotificationCard";
import { serverUrl } from "../App.jsx";
import axios from "axios";
import { setNotificationData } from "../redux/userSlice.js";

import { ClipLoader } from "react-spinners";

const Notifications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notificationData } = useSelector(
    (state) => state.user,
  );
  const ids = notificationData?.map((n) => n._id) || [];

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

  const markAsRead = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/markAsRead`,
        { notificationId: ids },
        { withCredentials: true },
      );
      await fetchNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    markAsRead();
  }, []);
  return (
    <div className="w-full h-[100vh] bg-black overflow-auto">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden">
        <IoArrowBackSharp
          className="text-white cursor-pointer w-[25px] h-[25px]"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white text-[20px] font-semibold">Notifications</h1>
      </div>

      <div className="w-full h-[100%] flex px-[10px] flex-col">
        {!notificationData ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <ClipLoader size={35} color="white" />
            <span className="text-gray-400 text-sm">Loading notifications...</span>
          </div>
        ) : notificationData.length === 0 ? (
          <div className="text-gray-400 py-20 text-center font-medium">No notifications yet</div>
        ) : (
          notificationData.map((noti, index) => (
            <NotificationCard noti={noti} key={noti._id || index} />
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
