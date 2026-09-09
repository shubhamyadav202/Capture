import axios from "axios";
import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App.jsx";
import { toggleFollow } from "../redux/userSlice.js";

const FollowButton = ({ targetUserId, tailwind, onFollowChange }) => {
  const { following } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const isFollowing = following?.some(
    (id) => (id?._id || id)?.toString() === targetUserId?.toString(),
  );
  const dispatch = useDispatch();

  const handleFollow = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/follow/${targetUserId}`,
        { withCredentials: true },
      );

      dispatch(toggleFollow(targetUserId));

      if (onFollowChange) {
        await onFollowChange();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      className={`${tailwind} ${loading ? "opacity-70 cursor-not-allowed" : ""} flex items-center justify-center`}
      onClick={handleFollow}
    >
      {loading ? (
        <ClipLoader size={16} color="currentColor" />
      ) : isFollowing ? (
        "Unfollow"
      ) : (
        "Follow"
      )}
    </button>
  );
};

export default FollowButton;
