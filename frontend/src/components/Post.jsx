import React, { useState } from "react";
import dp from "../assets/dp.jpg";
import { useDispatch, useSelector } from "react-redux";
import VideoPlayer from "./VideoPlayer.jsx";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { MdOutlineComment } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { IoSend, IoClose } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import { setPostData } from "../redux/postSlice.js";
import { setProfileData, setUserData } from "../redux/userSlice.js";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import FollowButton from "./FollowButton.jsx";
import SharePostModal from "./SharePostModal.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ClipLoader } from "react-spinners";

const Post = ({ post }) => {
  const { userData, profileData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { socket } = useSelector((state) => state.socket);
  const [showComment, setShowComment] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [message, setMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await axios.delete(`${serverUrl}/api/post/delete/${post._id}`, {
        withCredentials: true,
      });

      const updatedPosts = postData.filter((p) => p._id !== post._id);
      dispatch(setPostData(updatedPosts));

      if (profileData && profileData._id === userData?._id) {
        dispatch(
          setProfileData({
            ...profileData,
            posts: profileData.posts?.filter(
              (p) => (p?._id || p)?.toString() !== post._id?.toString(),
            ),
          }),
        );
      }

      if (userData?.posts) {
        dispatch(
          setUserData({
            ...userData,
            posts: userData.posts?.filter(
              (p) => (p?._id || p)?.toString() !== post._id?.toString(),
            ),
          }),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, {
        withCredentials: true,
      });

      const updatedPost = result.data;
      const updatedPosts = postData.map((p) =>
        p._id == post._id ? updatedPost : p,
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    if (!message.trim() || commentLoading) return;
    setCommentLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message },
        {
          withCredentials: true,
        },
      );

      const updatedPost = result.data;
      const updatedPosts = postData.map((p) =>
        p._id == post._id ? updatedPost : p,
      );
      dispatch(setPostData(updatedPosts));
      setMessage("");
    } catch (error) {
      console.log(error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId || deletingCommentId) return;
    setDeletingCommentId(commentId);
    try {
      const result = await axios.delete(
        `${serverUrl}/api/post/comment/${post._id}/${commentId}`,
        { withCredentials: true },
      );

      const updatedPosts = postData.map((p) =>
        p._id == post._id ? { ...p, comments: result.data.comments } : p,
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log("Delete comment error:", error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleSaved = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/post/saved/${post._id}`,
        {
          withCredentials: true,
        },
      );

      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    socket?.on("likedPost", (updatedData) => {
      const updatedPosts = postData.map((p) =>
        p._id == updatedData.postId ? { ...p, likes: updatedData.likes } : p,
      );
      dispatch(setPostData(updatedPosts));
    });

    socket?.on("commentedPost", (updatedData) => {
      const updatedPosts = postData.map((p) =>
        p._id == updatedData.postId
          ? { ...p, comments: updatedData.comments }
          : p,
      );
      dispatch(setPostData(updatedPosts));
    });

    socket?.on("deletedPost", (deletedData) => {
      const updatedPosts = postData.filter((p) => p._id !== deletedData.postId);
      dispatch(setPostData(updatedPosts));
    });

    return () => {
      socket?.off("likedPost");
      socket?.off("commentedPost");
      socket?.off("deletedPost");
    };
  }, [socket, postData, dispatch]);
  return (
    <div className="w-[90%] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl pb-[20px]">
      <div className="w-full h-[80px] flex justify-between items-center px-[10px]">
        <div className="flex justify-center items-center gap-[10px] md:gap-[20px]">
          <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
            <img
              src={post.author?.profileImage || dp}
              alt=""
              className="w-full object-cover"
              onClick={() => navigate(`/getProfile/${post.author.username}`)}
            />
          </div>
          <div
            className="w-[150px] font-semibold truncate"
            onClick={() => navigate(`/getProfile/${post.author.username}`)}
          >
            {post.author.username}
          </div>
        </div>
        {userData._id != post.author._id && (
          <FollowButton
            tailwind={
              "px-[10px] min-w-[60px] md:min-w-[100px] py-[5px] h-[30px] md:h-[40px] bg-black text-white rounded-2xl text-[14px] md:text-[16px] cursor-pointer"
            }
            targetUserId={post.author._id}
          />
        )}
      </div>

      <div className="w-[90%] flex items-center justify-center">
        {post.mediaType == "image" && (
          <div className="w-[90%] flex items-center justify-center">
            <img
              src={post.media}
              alt=""
              className="w-[80%] rounded-2xl object-cover"
            />
          </div>
        )}

        {post.mediaType == "video" && (
          <div className="w-[80%] flex flex-col items-center justify-center">
            <VideoPlayer media={post.media} />
          </div>
        )}
      </div>

      <div className="w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]">
        <div className="flex justify-center items-center gap-[10px]">
          <div className="flex justify-center items-center gap-[5px]">
            {!post.likes.includes(userData._id) && (
              <FaRegHeart
                className="w-[25px] cursor-pointer h-[25px]"
                onClick={handleLike}
              />
            )}
            {post.likes.includes(userData._id) && (
              <FaHeart
                className="w-[25px] cursor-pointer h-[25px] text-red-600"
                onClick={handleLike}
              />
            )}
            <span>{post.likes.length}</span>
          </div>
          <div
            className="flex justify-center items-center gap-[5px]"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <MdOutlineComment className="w-[25px] cursor-pointer h-[25px]" />
            <span>{post.comments.length}</span>
          </div>
          <div
            className="flex justify-center items-center gap-[5px]"
            onClick={() => setShowShare(true)}
          >
            <FiSend className="w-[24px] cursor-pointer h-[24px] hover:text-purple-600 transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-[15px]">
          {(post?.author?._id == userData?._id ||
            post?.author == userData?._id) &&
            (isDeleting ? (
              <ClipLoader size={20} color="#ef4444" />
            ) : (
              <RiDeleteBin5Fill
                className="w-[25px] cursor-pointer h-[25px] hover:text-red-500 transition-all"
                onClick={handleDelete}
              />
            ))}
          <div onClick={handleSaved}>
            {!userData.saved.includes(post?._id) && (
              <FaRegBookmark className="w-[25px] cursor-pointer h-[25px]" />
            )}
            {userData.saved.includes(post?._id) && (
              <FaBookmark className="w-[25px] cursor-pointer h-[25px]" />
            )}
          </div>
        </div>
      </div>

      {post.caption && (
        <div className="w-full px-[20px] gap-[10px] flex justify-start items-center">
          <h1>{post.author.username}</h1>
          <div>{post.caption}</div>
        </div>
      )}

      {showComment && (
        <div className="w-full flex flex-col gap-[20px] pb-[20px] border-t border-gray-200 pt-[15px]">
          <div className="w-full flex justify-between items-center px-[20px]">
            <span className="font-semibold text-gray-800 text-[16px]">Comments</span>
            <button
              onClick={() => setShowComment(false)}
              className="text-gray-500 hover:text-black cursor-pointer p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Close comments"
            >
              <IoClose className="w-[24px] h-[24px]" />
            </button>
          </div>

          <div className="w-full h-[80px] flex items-center justify-between px-[20px] relative">
            <div className="w-[40px] h-[40px] md:w-[60px] md:h-[60px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
              <img
                src={userData?.profileImage || dp}
                alt=""
                className="w-full object-cover"
              />
            </div>
            <input
              type="text"
              placeholder="Comment...."
              className="px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button
              disabled={commentLoading}
              className="absolute right-[20px] cursor-pointer disabled:opacity-50"
              onClick={handleComment}
            >
              {commentLoading ? (
                <ClipLoader size={18} color="black" />
              ) : (
                <IoSend className="w-[25px] h-[25px]" />
              )}
            </button>
          </div>

          <div className="w-full max-h-[300px] overflow-auto">
            {post.comments?.map((com, index) => {
              const isCommentAuthor =
                (com.author?._id || com.author)?.toString() ===
                userData?._id?.toString();
              const isPostAuthor =
                (post.author?._id || post.author)?.toString() ===
                userData?._id?.toString();
              const canDelete = isCommentAuthor || isPostAuthor;

              return (
                <div
                  key={com._id || index}
                  className="w-full px-[20px] py-[15px] flex items-center justify-between border-b-2 border-b-gray-200"
                >
                  <div className="flex items-center gap-[15px] flex-1 min-w-0">
                    <div
                      className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden flex-shrink-0"
                      onClick={() =>
                        com.author?.username &&
                        navigate(`/getProfile/${com.author.username}`)
                      }
                    >
                      <img
                        src={com.author?.profileImage || dp}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      {com.author?.username && (
                        <div
                          className="font-semibold cursor-pointer hover:underline truncate text-[14px] md:text-[15px]"
                          onClick={() =>
                            navigate(`/getProfile/${com.author.username}`)
                          }
                        >
                          {com.author.username}
                        </div>
                      )}
                      <div className="text-[14px] md:text-[15px] text-gray-800 break-words">
                        {com.message}
                      </div>
                    </div>
                  </div>

                  {canDelete && (
                    <div className="flex-shrink-0 ml-2">
                      {deletingCommentId === com._id ? (
                        <ClipLoader size={18} color="#ef4444" />
                      ) : (
                        <RiDeleteBin5Fill
                          className="w-[20px] h-[20px] text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                          onClick={() => handleDeleteComment(com._id)}
                          title="Delete Comment"
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showShare && (
        <SharePostModal
          postId={post._id}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
};

export default Post;
