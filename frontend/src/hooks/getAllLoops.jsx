import React, { useEffect } from "react";
import { serverUrl } from "../App.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLoopData } from "../redux/loopSlice.js";

const getAllLoops = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchLoops = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/loop/getAll`, {
          withCredentials: true,
        });

        dispatch(setLoopData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchLoops();
  }, [dispatch, userData]);
};

export default getAllLoops;
