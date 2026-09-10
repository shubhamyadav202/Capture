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
    <div className="w-screen h-screen bg-black overflow-hidden flex justify-center items-center relative">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px] z-[100]">
        <IoArrowBackSharp
          className="text-white cursor-pointer w-[25px] h-[25px] hover:text-gray-300 transition-colors"
          onClick={handleBack}
        />
        <h1 className="text-white text-[20px] font-semibold">Loops</h1>
      </div>

      {!loopData && fetchingLoop ? (
        <div className="flex flex-col items-center gap-3">
          <ClipLoader size={40} color="white" />
          <span className="text-gray-400 text-sm">Loading loops...</span>
        </div>
      ) : (
        <div className="h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
          {displayedLoops.map((loop, index) => (
            <div className="h-screen snap-start" key={loop?._id || index}>
              <LoopCard loop={loop} />
            </div>
          ))}
          {displayedLoops.length === 0 && !fetchingLoop && (
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
