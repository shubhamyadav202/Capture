import React, { useState } from "react";
import favicon from "../assets/favicon.svg";
import dp from "../assets/dp.jpg";
import { FaRegHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App.jsx";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
import OtherUsers from "./OtherUsers.jsx";
import { useNavigate } from "react-router-dom";
import Notifications from "./Notifications.jsx";

import { ClipLoader } from "react-spinners";

const LeftHome = () => {
  const { userData, suggestedUsers } = useSelector((state) => state.user);

  const [showNotification, setShowNotification] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notificationData } = useSelector((state) => state.user);

  const handleLogOut = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div
      className={`w-[25%] hidden lg:block h-[100vh] bg-[black] border-r-2 border-gray-900 ${showNotification ? "overflow-hidden" : "overflow-auto"} `}
    >
      <div className="w-full h-[100px] flex items-center justify-between p-[20px]">
        <img src={favicon} alt="" className="w-[60px]" />
        <div
          className="relative cursor-pointer"
          onClick={() => setShowNotification((prev) => !prev)}
        >
          <FaRegHeart className="text-[white] w-[25px] h-[25px]" />
          {notificationData?.length > 0 &&
            notificationData.some((noti) => noti.isRead === false) && (
              <div className="w-[10px] h-[10px] bg-red-500 rounded-full absolute top-0 right-[-5px]"></div>
            )}
        </div>
      </div>

      {!showNotification && (
        <>
          <div className="flex w-full items-center justify-between gap-[10px] px-[10px] border-b-2 border-b-gray-900 py-[10px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
                <img
                  src={userData.profileImage || dp}
                  alt=""
                  className="w-full object-cover"
                  onClick={() => navigate(`/getProfile/${userData.username}`)}
                />
              </div>
              <div>
                <div className="text-[18px] text-white font-semibold">
                  {userData.username}
                </div>
                <div className="text-[15px] text-gray-400 font-semibold">
                  {userData.name}
                </div>
              </div>
            </div>
            <div
              className="text-blue-500 font-semibold cursor-pointer flex items-center justify-center min-w-[60px]"
              onClick={handleLogOut}
            >
              {loggingOut ? <ClipLoader size={16} color="#3b82f6" /> : "Log out"}
            </div>
          </div>

          <div className="w-full flex flex-col gap-[20px] p-[20px]">
            <h1 className="text-white text-[19px]">Suggested Users</h1>
            {suggestedUsers &&
              suggestedUsers
                .slice(0, 3)
                .map((user, index) => <OtherUsers key={index} user={user} />)}
          </div>
        </>
      )}

      {showNotification && <Notifications />}
    </div>
  );
};

export default LeftHome;
