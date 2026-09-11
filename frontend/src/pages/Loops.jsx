import React, { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import LoopCard from "../components/LoopCard.jsx";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App.jsx";

const Loops = () => {
  const navigate = useNavigate();
  const { loopId } = useParams();
  const { loopData } = useSelector((state) => state.loop);
  const [fetchedLoop, setFetchedLoop] = useState(null);
  const [fetchingLoop, setFetchingLoop] = useState(false);

  // If a loopId is in URL, fetch it if it's not already in Redux loopData
  useEffect(() => {
    if (!loopId) return;

    const alreadyInRedux = loopData?.some(
      (l) => (l?._id || l)?.toString() === loopId.toString(),
    );

    if (!alreadyInRedux && !fetchedLoop) {
      setFetchingLoop(true);
      axios
        .get(`${serverUrl}/api/loop/getLoop/${loopId}`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data) {
            setFetchedLoop(res.data);
          }
        })
        .catch((err) => {
          console.log("Error fetching loop by id:", err);
        })
        .finally(() => {
          setFetchingLoop(false);
        });
    }
  }, [loopId, loopData, fetchedLoop]);

  // Construct displayed loops:
  // If loopId is specified, place that loop at the very top (index 0)
  // so it immediately appears and plays, followed by all other loops.
  let displayedLoops = loopData
    ? loopData.filter((loop) => loop?.media && loop?.author?.username)
    : [];

  if (loopId) {
    const targetLoop =
      displayedLoops.find(
        (l) => (l?._id || l)?.toString() === loopId.toString(),
      ) || (fetchedLoop?.media && fetchedLoop?.author?.username ? fetchedLoop : null);

    if (targetLoop) {
      const others = displayedLoops.filter(
        (l) => (l?._id || l)?.toString() !== loopId.toString(),
      );
      displayedLoops = [targetLoop, ...others];
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="w-screen h-[100dvh] bg-black overflow-hidden flex justify-center items-center relative">
      {!loopData && fetchingLoop ? (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <div className="w-full h-[60px] flex items-center gap-3 px-4 absolute top-0 left-0 z-[100]">
            <IoArrowBackSharp
              className="text-white cursor-pointer w-6 h-6 hover:text-gray-300 transition-colors"
              onClick={handleBack}
            />
            <h1 className="text-white text-[20px] font-semibold">Loops</h1>
          </div>
          <ClipLoader size={40} color="white" />
          <span className="text-gray-400 text-sm mt-3">Loading loops...</span>
        </div>
      ) : (
        <div className="w-full h-[100dvh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide flex flex-col items-center">
          {displayedLoops.map((loop, index) => (
            <div
              className="w-full lg:w-[480px] h-[100dvh] snap-start shrink-0 relative flex justify-center items-center"
              key={loop?._id || index}
            >
              <LoopCard loop={loop} onBack={handleBack} />
            </div>
          ))}
          {displayedLoops.length === 0 && !fetchingLoop && (
            <div className="h-[100dvh] w-full flex flex-col items-center justify-center text-gray-500 relative">
              <div className="w-full h-[60px] flex items-center gap-3 px-4 absolute top-0 left-0 z-[100]">
                <IoArrowBackSharp
                  className="text-white cursor-pointer w-6 h-6 hover:text-gray-300 transition-colors"
                  onClick={handleBack}
                />
                <h1 className="text-white text-[20px] font-semibold">Loops</h1>
              </div>
              <span>No loops available</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Loops;
