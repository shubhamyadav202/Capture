import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IoArrowBackSharp } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import Post from "../components/Post.jsx";
import Nav from "../components/Nav.jsx";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { postData } = useSelector((state) => state.post);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync with redux postData if already present or when updated
  useEffect(() => {
    if (postData && postId) {
      const foundInRedux = postData.find(
        (p) => (p?._id || p)?.toString() === postId.toString(),
      );
      if (foundInRedux) {
        setPost(foundInRedux);
        setLoading(false);
      }
    }
  }, [postData, postId]);

  // Always fetch fresh post data from backend
  useEffect(() => {
    let isMounted = true;
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const res = await axios.get(`${serverUrl}/api/post/getPost/${postId}`, {
          withCredentials: true,
        });
        if (isMounted) {
          setPost(res.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          // If we haven't found it in redux either, display error
          if (!post) {
            setError(err?.response?.data?.message || "Post not found or has been deleted");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center pb-[120px] relative">
      {/* Top Header */}
      <div className="w-full max-w-[650px] h-[70px] flex items-center justify-between px-[20px] text-white sticky top-0 bg-black/80 backdrop-blur-md z-[50]">
        <div className="flex items-center gap-4">
          <IoArrowBackSharp
            className="cursor-pointer text-white w-[26px] h-[26px] hover:text-gray-300 transition-colors"
            onClick={handleBack}
          />
          <h1 className="text-[20px] font-bold text-white tracking-wide">Post</h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[650px] flex flex-col items-center px-[10px] mt-2">
        {loading && !post ? (
          <div className="py-32 flex flex-col items-center gap-3">
            <ClipLoader size={38} color="white" />
            <span className="text-gray-400 text-sm font-medium">Loading post...</span>
          </div>
        ) : error && !post ? (
          <div className="py-32 flex flex-col items-center gap-4 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-3xl">
              🔍
            </div>
            <p className="text-gray-300 text-lg font-medium">{error}</p>
            <button
              onClick={handleBack}
              className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:opacity-90 transition-all shadow-lg shadow-purple-500/30"
            >
              Go Back
            </button>
          </div>
        ) : (
          post && <Post post={post} />
        )}
      </div>

      {/* Floating Navigation */}
      <Nav />
    </div>
  );
};

export default PostDetail;
