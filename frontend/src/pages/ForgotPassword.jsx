import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App.jsx";
import favicon from "../assets/favicon.svg";
import textlogoblack from "../assets/textlogoblack.png";
import axios from "axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [inputClicked, setInputClicked] = useState({
    email: false,
    otp: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStep1 = async (req, res) => {
    setLoading(true);
    setError("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/sendOtp`,
        { email },
        { withCredentials: true },
      );
      console.log(result.data);
      setStep(2);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message);
      setLoading(false);
      console.log(error);
    }
  };

  const handleStep2 = async (req, res) => {
    setLoading(true);
    setError("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verifyOtp`,
        { email, otp },
        { withCredentials: true },
      );
      console.log(result.data);
      setStep(3);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message);
      console.log(error);
      setLoading(false);
    }
  };

  const handleStep3 = async (req, res) => {
    if (newPassword !== confirmNewPassword) {
      return setError("Password Doesn't Matched");
    }
    setError("");
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/resetPassword`,
        { email, password: newPassword },
        { withCredentials: true },
      );
      console.log(result.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message);
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black to-gray-900 flex flex-col justify-center items-center text-white">
      {step == 1 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]">
          <img src={favicon} alt="" className="w-[70px]" />
          <h2 className="text-[30px] font-semibold text-black">
            Forgot Password
          </h2>
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] mt-[30px] rounded-2xl border-2 border-black "
            onClick={() => setInputClicked({ ...inputClicked, email: true })}
          >
            <label
              htmlFor="email"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.email ? "top-[-15px]" : ""}`}
            >
              Enter Your Email
            </label>
            <input
              type="text"
              id="email"
              className="w-[100%] h-[100%] rounded-2xl text-black px-[20px] outline-none border-0"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
            onClick={handleStep1}
            disabled={loading}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Send OTP"}
          </button>
        </div>
      )}

      {step == 2 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]">
          <img src={favicon} alt="" className="w-[70px]" />
          <h2 className="text-[30px] font-semibold text-black">
            Forgot Password
          </h2>
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] mt-[30px] rounded-2xl border-2 border-black "
            onClick={() => setInputClicked({ ...inputClicked, otp: true })}
          >
            <label
              htmlFor="otp"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.otp ? "top-[-15px]" : ""}`}
            >
              Enter Otp
            </label>
            <input
              type="text"
              id="otp"
              className="w-[100%] h-[100%] rounded-2xl text-black px-[20px] outline-none border-0"
              required
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
            onClick={handleStep2}
            disabled={loading}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Submit"}
          </button>
        </div>
      )}

      {step == 3 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]">
          <img src={favicon} alt="" className="w-[70px]" />
          <h2 className="text-[30px] font-semibold text-black">
            Reset Password
          </h2>
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] mt-[30px] rounded-2xl border-2 border-black "
            onClick={() =>
              setInputClicked({ ...inputClicked, newPassword: true })
            }
          >
            <label
              htmlFor="newPassword"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.newPassword ? "top-[-15px]" : ""}`}
            >
              Enter Your New Password
            </label>
            <input
              type="text"
              id="newPassword"
              className="w-[100%] h-[100%] rounded-2xl text-black px-[20px] outline-none border-0"
              required
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
          </div>
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] mt-[30px] rounded-2xl border-2 border-black "
            onClick={() =>
              setInputClicked({ ...inputClicked, confirmNewPassword: true })
            }
          >
            <label
              htmlFor="confirmNewPassword"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${inputClicked.confirmNewPassword ? "top-[-15px]" : ""}`}
            >
              Confirm Your New Password
            </label>
            <input
              type="text"
              id="confirmNewPassword"
              className="w-[100%] h-[100%] rounded-2xl text-black px-[20px] outline-none border-0"
              required
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              value={confirmNewPassword}
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <button
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
            onClick={handleStep3}
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={30} color="white" />
            ) : (
              "Reset Password"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
