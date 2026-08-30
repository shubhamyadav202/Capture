import React from "react";
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import { FaRegSquarePlus } from "react-icons/fa6";
import dp from "../assets/dp.jpg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Nav = () => {
    const navigate = useNavigate();
    const {userData} = useSelector(state => state.user);

  return (
    <div className="w-[90%] lg:w-[40%] h-[80px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]">
      <div onClick={() => navigate("/")} className="cursor-pointer">
        <GoHomeFill className="text-white w-[25px] h-[25px]" />
      </div>
      <div className="cursor-pointer">
        <FiSearch className="text-white w-[25px] h-[25px]" />
      </div>
      <div className="cursor-pointer" onClick={()=> navigate("/upload")}>
        <FaRegSquarePlus className="text-white w-[25px] h-[25px]" />
      </div>
      <div className="cursor-pointer" onClick={()=>navigate("/loops")}>
        <RxVideo className="text-white w-[28px] h-[28px]" />
      </div>
      <div
        className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
        onClick={() => navigate(`/getProfile/${userData.username}`)}
      >
        <img
          src={userData.profileImage || dp}
          alt=""
          className="w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Nav;
