import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import NotificationCard from "./NotificationCard";

const Notifications = () => {
  const navigate = useNavigate();
  const { notificationData } = useSelector((state) => state.user);
  return (
    <div className="w-full h-[100vh] bg-black">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden">
        <IoArrowBackSharp
          className="text-white cursor-pointer cursor-pointer w-[25px] h-[25px]"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white text-[20px] font-semibold">Notifications</h1>
      </div>

      <div className="w-full h-[100%] overflow-auto flex px-[10px] flex-col">
        {notificationData?.map((noti,index)=>(
            <NotificationCard noti={noti} key={index}/>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
