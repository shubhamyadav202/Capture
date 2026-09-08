import React from "react";
import dp from "../assets/dp.jpg";
import { useNavigate } from "react-router-dom";

const NotificationCard = ({ noti }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-[50px] flex justify-between p-[5px] bg-gray-800 rounded-full px-[10px] my-[5px]">
      <div className="flex items-center gap-[10px]">
        <div
          className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
          onClick={() => navigate(`/getProfile/${noti?.sender?.username}`)}
        >
          <img
            src={noti?.sender?.profileImage || dp}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-[14px] flex flex-col">
          <span className="font-semibold text-white text-[16px]">
            {noti?.sender?.username}{" "}
          </span>
          <span className="text-gray-300 text-[15px]">{noti?.message}</span>
        </div>
      </div>

      <div className="w-[40px] h-[40px] border-1 border-black rounded-full overflow-hidden">
        {noti.post && noti?.post?.mediaType == "image" ? (
          <img src={noti?.post?.media} className="w-full h-full object-cover" />
        ) : (
          <video
            src={noti?.post?.media}
            muted
            loop
            className="w-full h-full  object-cover"
          />
        )}
        {noti.loop && (
          <video
            src={noti?.loop?.media}
            muted
            loop
            className="w-full h-full  object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
