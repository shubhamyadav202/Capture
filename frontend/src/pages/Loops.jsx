import React from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import LoopCard from "../components/LoopCard.jsx";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const Loops = () => {
  const navigate = useNavigate();
  const { loopData } = useSelector((state) => state.loop);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex justify-center items-center relative">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px] z-[100]">
        <IoArrowBackSharp
          className="text-white cursor-pointer w-[25px] h-[25px]"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-[20px] font-semibold">Loops</h1>
      </div>

      {!loopData ? (
        <div className="flex flex-col items-center gap-3">
          <ClipLoader size={40} color="white" />
          <span className="text-gray-400 text-sm">Loading loops...</span>
        </div>
      ) : (
        <div className="h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
          {loopData
            ?.filter((loop) => loop?.media && loop?.author?.username)
            .map((loop, index) => (
              <div className="h-screen snap-start" key={loop?._id || index}>
                <LoopCard loop={loop} />
              </div>
            ))}
          {loopData?.filter((loop) => loop?.media && loop?.author?.username).length === 0 && (
            <div className="h-screen flex items-center justify-center text-gray-500">
              No loops available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Loops;
