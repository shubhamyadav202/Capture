import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPrevChatUsers } from "../redux/messageSlice.js";

function getPrevChatUsers() {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.message);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/message/prevChats`, {
          withCredentials: true,
        });
        dispatch(setPrevChatUsers(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [messages]);
}

export default getPrevChatUsers;
