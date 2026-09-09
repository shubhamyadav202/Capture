import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { FaVolumeHigh } from "react-icons/fa6";
import { IoMdVolumeOff } from "react-icons/io";
import { ClipLoader } from "react-spinners";

const VideoPlayer = ({ media }) => {
  const videoTag = useRef();
  const [mute, setMute] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoTag.current;
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.2 },
    );

    if (videoTag.current) {
      observer.observe(videoTag.current);
    }

    return () => {
      if (videoTag.current) {
        observer.unobserve(videoTag.current);
      }
    };
  }, []);

  const handleVideoLoaded = () => {
    setIsLoading(false);
    if (isPlaying && videoTag.current) {
      videoTag.current.play().catch(() => {});
    }
  };

  const handleClick = () => {
    if (!videoTag.current) return;
    if (isPlaying) {
      videoTag.current.pause();
      setIsPlaying(false);
    } else {
      videoTag.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full h-full relative cursor-pointer overflow-hidden rounded-2xl flex items-center justify-center">
      <video
        ref={videoTag}
        src={media}
        autoPlay
        loop
        muted={mute}
        playsInline
        preload="auto"
        className="w-full h-full object-contain rounded-2xl"
        onClick={handleClick}
        onLoadedData={handleVideoLoaded}
        onCanPlay={handleVideoLoaded}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
      ></video>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="p-3 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-xl">
            <ClipLoader size={35} color="white" />
          </div>
        </div>
      )}

      <div
        className="absolute bottom-[15px] right-[15px] bg-black/60 hover:bg-black p-2 rounded-full cursor-pointer z-10 transition-all backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          setMute((prev) => !prev);
        }}
      >
        {!mute ? (
          <FaVolumeHigh className="w-[18px] h-[18px] text-white font-semibold" />
        ) : (
          <IoMdVolumeOff className="w-[18px] h-[18px] text-white font-semibold" />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
