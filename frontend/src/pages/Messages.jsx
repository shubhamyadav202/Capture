import React from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { BiMessageRoundedDots } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OnlineUser from "../components/OnlineUser.jsx";
import { setSelectedUser } from "../redux/messageSlice.js";
import { ClipLoader } from "react-spinners";
import dp from "../assets/dp.jpg";

const Messages = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { onlineUsers } = useSelector((state) => state.socket);
  const { prevChatUsers } = useSelector(
    (state) => state.message,
  );
  const dispatch = useDispatch();

  return (
    <div className="w-full min-h-[100vh] flex flex-col bg-black gap-[20px] p-[10px]">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
        <IoArrowBackSharp
          className="text-white lg:hidden cursor-pointer w-[25px] h-[25px]"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-[20px] font-semibold">Messages</h1>
      </div>

      <div className="w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto p-[20px] border-b-2 border-gray-800 ">
        {userData.following?.map(
          (user, index) =>
            onlineUsers?.includes(user._id) && <OnlineUser key={user._id || index} user={user} />,
        )}
      </div>

      <div className="w-full h-full overflow-auto flex flex-col gap-[20px]">
        {!prevChatUsers ? (
          <div className="w-full py-20 flex flex-col items-center gap-3">
            <ClipLoader size={35} color="white" />
            <span className="text-gray-400 text-sm">Loading chats...</span>
          </div>
        ) : prevChatUsers.length === 0 ? (
          <div className="text-gray-400 text-center py-20">No conversations yet</div>
        ) : (
          prevChatUsers.map((user, index) => (
            <div
              key={user._id || index}
              className="text-white cursor-pointer w-full flex items-center gap-[10px] hover:bg-gray-900 p-2 rounded-xl transition-all"
              onClick={() => {
                dispatch(setSelectedUser(user));
                navigate("/messageArea");
              }}
            >
              {onlineUsers?.includes(user._id) ? (
                <OnlineUser user={user} />
              ) : (
                <div
                  className="w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/getProfile/${user.username}`)}
                >
                  <img
                    src={user.profileImage || dp}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <div className="text-white text-[18px] font-semibold">
                  {user.username}
                </div>
                {onlineUsers?.includes(user?._id) && (
                  <div className="text-[#0aff0a] text-[15px]">Active Now</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;
