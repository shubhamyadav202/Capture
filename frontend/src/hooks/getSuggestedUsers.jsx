import React, { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedUsers } from "../redux/userSlice.js";
import axios from "axios";

const getSuggestedUsers = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/suggested`, {
          withCredentials: true,
        });

        dispatch(setSuggestedUsers(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [userData]);
};

export default getSuggestedUsers;
