import React from 'react';
import { useDispatch, useSelector } from "react-redux";

const ReceiverMessage = ({message}) => {
    const { userData } = useSelector((state) => state.user);
    const { selectedUser } = useSelector((state) => state.message);
  return (
    <div className="w-fit max-w-[60%] bg-[#1a1f1f] rounded-t-2xl rounded-br-2xl rounded-bl-0 px-[10px] py-[10px] relative left-0 flex flex-col gap-[10px]">
      {message.image && (
        <img
          src={message.image}
          className="h-[200px] object-cover rounded-2xl"
          alt=""
        />
      )}

      {message.message && (
        <div className="text-[18px] text-white wrap-break-word">
          {message.message}
        </div>
      )}

      <div className="w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute left   -[-25px] bottom-[-40px]">
        <img
          src={selectedUser.profileImage}
          alt=""
          className="w-full object-cover"
        />
      </div>
    </div>  
  );
}

export default ReceiverMessage;
