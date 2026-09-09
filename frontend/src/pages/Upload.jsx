import React, { useRef, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FaRegSquarePlus } from "react-icons/fa6";
import VideoPlayer from "../components/VideoPlayer.jsx";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { setPostData } from "../redux/postSlice.js";
import { setCurrentUserStory, setStoryData } from "../redux/storySlice.js";
import { setLoopData } from "../redux/loopSlice.js";
import { setUserData } from "../redux/userSlice.js";

const Upload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fromStory =
    location.state?.from === "story" || searchParams.get("mode") === "story";
  const [uploadType, setUploadType] = useState(fromStory ? "story" : "post");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const mediaInput = useRef();
  const dispatch = useDispatch();
  const { postData } = useSelector((state) => state.post);
  const { storyData } = useSelector((state) => state.story);
  const { loopData } = useSelector((state) => state.loop);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleMedia = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBackendMedia(file);

    const isVideo =
      file.type.startsWith("video/") ||
      /\.(mp4|mov|webm|mkv|avi)$/i.test(file.name);

    if (isVideo) {
      setMediaType("video");
    } else {
      setMediaType("image");
    }

    setFrontendMedia(URL.createObjectURL(file));
  };

  const uploadPost = async () => {
    setLoading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const result = await axios.post(
        `${serverUrl}/api/post/upload`,
        formData,
        {
          withCredentials: true,
          onUploadProgress: (e) => {
            if (e.total) {
              setUploadProgress(Math.round((e.loaded * 100) / e.total));
            }
          },
        },
      );

      dispatch(setPostData([result.data, ...(postData || [])]));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log("Upload post error:", error.response?.data || error);
      setLoading(false);
    }
  };

  const uploadStory = async () => {
    setLoading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const result = await axios.post(
        `${serverUrl}/api/story/upload`,
        formData,
        {
          withCredentials: true,
          onUploadProgress: (e) => {
            if (e.total) {
              setUploadProgress(Math.round((e.loaded * 100) / e.total));
            }
          },
        },
      );
      dispatch(setCurrentUserStory(result.data));
      dispatch(setStoryData(result.data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const uploadLoop = async () => {
    setLoading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("media", backendMedia);

      const result = await axios.post(
        `${serverUrl}/api/loop/upload`,
        formData,
        {
          withCredentials: true,
          onUploadProgress: (e) => {
            if (e.total) {
              setUploadProgress(Math.round((e.loaded * 100) / e.total));
            }
          },
        },
      );

      dispatch(setLoopData([result.data, ...(loopData || [])]));
      setLoading(false);
      navigate("/loops");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleUpload = () => {
    if (uploadType == "post") {
      uploadPost();
    } else if (uploadType == "story") {
      uploadStory();
    } else {
      uploadLoop();
    }
  };

  return (
    <div className="w-full min-h-[100vh] bg-black flex flex-col items-center pb-[50px] overflow-y-auto">
      <input
        type="file"
        accept={uploadType === "loop" ? "video/*" : "image/*,video/*"}
        hidden
        ref={mediaInput}
        onChange={handleMedia}
      />

      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
        <IoArrowBackSharp
          className="text-white cursor-pointer w-[25px] h-[25px]"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-[20px] font-semibold">Upload Media</h1>
      </div>

      <div className="w-[90%] max-w-[600px] h-[70px] bg-[white] rounded-full flex justify-around items-center gap-[10px]">
        {!fromStory && (
          <div
            className={`${uploadType == "post" ? "bg-black text-white shadow-2xl shadow-black " : ""}w-[28%] h-[80%] flex justify-center items-center text-[18px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black transition-all`}
            onClick={() => {
              setUploadType("post");
              setFrontendMedia(null);
              setBackendMedia(null);
              setCaption("");
            }}
          >
            Post
          </div>
        )}

        <div
          className={`${uploadType == "story" ? "bg-black text-white shadow-2xl shadow-black " : ""}${fromStory ? "w-[45%]" : "w-[28%]"} h-[80%] flex justify-center items-center text-[18px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black transition-all`}
          onClick={() => {
            setUploadType("story");
            setFrontendMedia(null);
            setBackendMedia(null);
            setCaption("");
          }}
        >
          Story
        </div>

        <div
          className={`${uploadType == "loop" ? "bg-black text-white shadow-2xl shadow-black " : ""}${fromStory ? "w-[45%]" : "w-[28%]"} h-[80%] flex justify-center items-center text-[18px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black transition-all`}
          onClick={() => {
            setUploadType("loop");
            setFrontendMedia(null);
            setBackendMedia(null);
            setCaption("");
          }}
        >
          Loop
        </div>
      </div>

      {!frontendMedia && (
        <div
          className="w-[85%] max-w-[450px] h-[300px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-[12px] mt-[40px] rounded-2xl cursor-pointer hover:bg-[#1a2126] transition-all"
          onClick={() => mediaInput.current?.click()}
        >
          <FaRegSquarePlus className="text-white cursor-pointer w-[35px] h-[35px]" />
          <div className="text-white text-[18px] font-medium">
            Select {uploadType} to upload
          </div>
          <span className="text-gray-400 text-xs">
            {uploadType === "loop" ? "Supports MP4, MOV, WebM videos" : "Supports photos and videos"}
          </span>
        </div>
      )}

      {frontendMedia && (
        <div className="w-[85%] max-w-[450px] flex flex-col items-center mt-[30px]">
          <div className="w-full h-[320px] md:h-[380px] bg-[#0e1316] border border-gray-800 rounded-2xl overflow-hidden relative flex items-center justify-center">
            {mediaType === "image" && (
              <img
                src={frontendMedia}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            )}
            {mediaType === "video" && (
              <video
                src={frontendMedia}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-full object-contain"
              />
            )}
            <button
              type="button"
              className="absolute top-3 right-3 bg-black/75 hover:bg-black text-white text-xs px-3 py-1.5 rounded-full border border-gray-600 transition-all cursor-pointer backdrop-blur-sm shadow-md"
              onClick={() => mediaInput.current?.click()}
            >
              Change
            </button>
          </div>

          {uploadType !== "story" && (
            <input
              type="text"
              className="w-full border-b-gray-600 border-b outline-none px-[10px] py-[10px] text-white bg-transparent mt-[20px] focus:border-white transition-all text-[15px]"
              placeholder="Write a caption..."
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
            />
          )}

          <button
            className="w-full h-[48px] bg-white text-black font-semibold rounded-2xl mt-[25px] hover:bg-gray-200 transition-all flex items-center justify-center cursor-pointer shadow-lg disabled:opacity-50 gap-2"
            disabled={loading}
            onClick={handleUpload}
          >
            {loading ? (
              <>
                <ClipLoader size={20} color="black" />
                <span className="text-sm font-semibold">
                  {uploadProgress > 0 && uploadProgress < 100
                    ? `Uploading ${uploadProgress}%`
                    : "Processing on server..."}
                </span>
              </>
            ) : (
              `Upload ${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Upload;
