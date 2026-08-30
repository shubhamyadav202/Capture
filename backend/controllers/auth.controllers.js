import generateToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sendMail from "../config/mail.js";

export const signUp = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const findByEmail = await User.findOne({ email });
    if (findByEmail) {
      return res.status(400).json({ message: "Email Already Exists !" });
    }

    const findByUsername = await User.findOne({ username });
    if (findByUsername) {
      return res.status(400).json({ message: "Username Already Exists !" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password Must be of Atleast 6 Characters" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Signup Error : ${error}` });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found !" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // it will return true or false

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Passsword !" });
    }

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Singin Error ${error}` });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Sign out Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Singout Error ${error}` });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();
    await sendMail(email, otp);
    return res.status(200).json({ message: "Email Successfully Sent" });
  } catch (error) {
    return res.status(500).json({ message: `Send Otp Error ${error}` });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or Expired Otp" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Otp Verified" });
  } catch (error) {
    return res.status(500).json({ message: `Verify Otp Error ${error}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return (
        res.status(400),
        json({ message: "Otp Verification is Required" })
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Reset Otp Error ${error}` });
  }
};
