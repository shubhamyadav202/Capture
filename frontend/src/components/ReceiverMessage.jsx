import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.jpg";

const ReceiverMessage = ({ message }) => {
  const { selectedUser } = useSelector((state) => state.message);
  const scroll = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isVideo =
    message?.mediaType === "video" ||
    (message?.image &&
      (message.image.includes("/video/upload/") ||
        message.image.match(/\.(mp4|webm|mov|mkv|avi)($|\?)/i)));

  const sharedPost = message?.sharedPost;
  const sharedLoop = message?.sharedLoop;

  return (
    <div
      ref={scroll}
      className="w-fit max-w-[70%] sm:max-w-[60%] bg-[#1a1f1f] rounded-t-2xl rounded-br-2xl rounded-bl-0 px-[10px] py-[10px] relative left-0 flex flex-col gap-[10px]"
    >
      {sharedPost && (
        <div
          className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer hover:bg-white/20 transition-all border border-white/15"
          onClick={() => {
            const postId = sharedPost?._id || (typeof sharedPost === "string" ? sharedPost : null);
            if (postId) {
              navigate(`/post/${postId}`);
            }
          }}
        >
          {/* Post author header */}
          <div
            className="flex items-center gap-[8px] px-[10px] py-[8px]"
            onClick={(e) => {
              e.stopPropagation();
              if (sharedPost.author?.username) {
                navigate(`/getProfile/${sharedPost.author.username}`);
              }
            }}
          >
            <div className="w-[28px] h-[28px] rounded-full overflow-hidden border border-white/30 flex-shrink-0">
              <img
                src={sharedPost.author?.profileImage || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-[12px] font-semibold truncate hover:underline">
              {sharedPost.author?.username || "Unknown"}
            </span>
          </div>

          {/* Post media */}
          {sharedPost.media && (
            <div className="w-full max-h-[180px] overflow-hidden">
              {sharedPost.mediaType === "video" ? (
                <div className="w-full h-[120px] bg-black/30 flex items-center justify-center">
                  <span className="text-white/80 text-[12px]">🎬 Video</span>
                </div>
              ) : (
                <img
                  src={sharedPost.media}
                  alt=""
                  className="w-full object-cover max-h-[180px]"
                />
              )}
            </div>
          )}

          {/* Post caption */}
          {sharedPost.caption && (
            <div className="px-[10px] py-[6px]">
              <p className="text-white/80 text-[12px] line-clamp-2">
                {sharedPost.caption}
              </p>
            </div>
          )}
        </div>
      )}

      {sharedLoop && (
        <div
          className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer hover:bg-white/20 transition-all border border-white/15"
          onClick={() => {
            const loopId = sharedLoop?._id || (typeof sharedLoop === "string" ? sharedLoop : null);
            if (loopId) {
              navigate(`/loops/${loopId}`);
            }
          }}
        >
          {/* Loop author header */}
          <div
            className="flex items-center gap-[8px] px-[10px] py-[8px]"
            onClick={(e) => {
              e.stopPropagation();
              if (sharedLoop.author?.username) {
                navigate(`/getProfile/${sharedLoop.author.username}`);
              }
            }}
          >
            <div className="w-[28px] h-[28px] rounded-full overflow-hidden border border-white/30 flex-shrink-0">
              <img
                src={sharedLoop.author?.profileImage || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-[12px] font-semibold truncate hover:underline">
              {sharedLoop.author?.username || "Unknown"}
            </span>
          </div>

          {/* Loop video preview */}
          <div className="w-full h-[160px] bg-black/30 overflow-hidden relative">
            <video
              src={sharedLoop.media}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="text-white text-[20px]">🎬</span>
            </div>
          </div>

          {/* Loop caption */}
          {sharedLoop.caption && (
            <div className="px-[10px] py-[6px]">
              <p className="text-white/80 text-[12px] line-clamp-2">
                {sharedLoop.caption}
              </p>
            </div>
          )}
        </div>
      )}

      {message.image && (
        isVideo ? (
          <div className="rounded-2xl overflow-hidden bg-black max-w-full">
            <video
              src={message.image}
              controls
              playsInline
              className="max-h-[280px] w-full rounded-2xl object-contain bg-black"
            />
          </div>
        ) : (
          <img
            src={message.image}
            className="max-h-[250px] object-cover rounded-2xl"
            alt=""
          />
        )
      )}

      {message.message && !sharedPost && !sharedLoop && (
        <div className="text-[18px] text-white break-words">
          {message.message}
        </div>
      )}

      <div className="w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden absolute left-[-25px] bottom-[-40px]">
        <img
          src={selectedUser?.profileImage || dp}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ReceiverMessage;

