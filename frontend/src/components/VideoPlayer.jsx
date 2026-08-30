import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { FaVolumeHigh } from "react-icons/fa6";
import { IoMdVolumeOff } from "react-icons/io";

const VideoPlayer = ({ media }) => {
  const videoTag = useRef();
  const [mute, setMute] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoTag.current;
        if (entry.isIntersecting) {
          video.play();
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 },
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

  const handleClick = () => {
    if (isPlaying) {
      videoTag.current.pause();
      setIsPlaying(false);
    } else {
      videoTag.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="h-[100%] relative cursor-pointer max-w-full overflow-hidden rounded-2xl">
      <video
        ref={videoTag}
        src={media}
        autoPlay
        loop
        muted={mute}
        className="h-[100%] cursor-pointer w-full object-cover rounded-2xl"
        onClick={handleClick}
      ></video>

      <div
        className="absolute bottom-[10px] right-[10px]"
        onClick={() => setMute((prev) => !prev)}
      >
        {!mute ? (
          <FaVolumeHigh className="w-[20px] h-[20px] text-white font-semibold" />
        ) : (
          <IoMdVolumeOff className="w-[20px] h-[20px] text-white font-semibold" />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
