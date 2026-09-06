import React from "react";

const OnlineUsers = ({user}) => {
  return (
    <div className="w-[60px] h-[60px] flex gap-[20px] justify-start items-center relative">


      <div
        className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
        onClick={() => navigate(`/getProfile/${user.username}`)}
      >
        <img
          src={user.profileImage || dp}
          alt=""
          className="w-full object-cover"
        />
      </div>
    </div>
  );
};

export default OnlineUsers;
