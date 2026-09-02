import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App.jsx";
import { toggleFollow } from "../redux/userSlice.js";

const FollowButton = ({ targetUserId, tailwind, onFollowChange }) => {
  const { following } = useSelector((state) => state.user);
  const isFollowing = following.includes(targetUserId);
  const dispatch = useDispatch();

  const handleFollow = async () => {
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
    }
  };

  return (
    <button className={tailwind} onClick={handleFollow}>
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
