import React from 'react';
import { IoArrowBackSharp } from "react-icons/io5";
import { BiMessageRoundedDots } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const navigate = useNavigate();
  return (
    <div className='w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[10px]'>
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
        <IoArrowBackSharp
          className="text-white lg:hidden cursor-pointer w-[25px] h-[25px]"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-[20px] font-semibold">Messages</h1>
      </div>
    </div>
  );
}

export default Messages;
