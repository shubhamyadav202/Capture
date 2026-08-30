import React, { useState } from "react";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import signuplogo from "../assets/form.png";
import favicon from "../assets/favicon.svg";
import textlogo from "../assets/textlogo.png";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

function Signin() {
  const [inputClicked, setInputClicked] = useState({
    username: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { username, password },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message);
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black to-gray-900 flex flex-col justify-center items-center text-white">
      <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">
        <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center justify-center p-[10px] gap-[20px]">
          <div className="flex justify-center items-center text-[20px] font-semibold mt-[40px]">
            <img src={favicon} alt="" className="w-[50px]" />
            <span className="text-black">Sign In</span>
          </div>

          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black "
            onClick={() => setInputClicked({ ...inputClicked, username: true })}
          >
            <label
              htmlFor="username"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.username ? "top-[-15px]" : ""}`}
            >
              Enter Your Username
            </label>
            <input
              type="text"
              id="username"
              className="w-[100%] h-[100%] rounded-2xl text-black px-[20px] outline-none border-0"
              required
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>

          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black "
            onClick={() => setInputClicked({ ...inputClicked, password: true })}
          >
            <label
              htmlFor="password"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.password ? "top-[-15px]" : ""}`}
            >
              Enter Your Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-[100%] h-[100%] rounded-2xl text-black px-[20px] outline-none border-0"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {!showPassword ? (
              <IoIosEye
                className="absolute text-black cursor-pointer right-[20px] w-[25px] h-[25px]"
                onClick={() => setShowPassword(true)}
              />
            ) : (
              <IoIosEyeOff
                className="absolute text-black cursor-pointer right-[20px] w-[25px] h-[25px]"
                onClick={() => setShowPassword(false)}
              />
            )}
          </div>
          <div
            className="text-black px-[20px] w-[90%] cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password ?
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Sign In"}
          </button>
          <p className="cursor-pointer text-gray-800">
            Want to Create a New Account ?
            <span
              className="border-b-2 border-b-black pb-[3px] text-black"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
        <div className="md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black">
          <img src={textlogo} alt="" className="w-[80%]" />
          <p>Share the Moments</p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
