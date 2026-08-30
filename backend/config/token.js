import jwt from "jsonwebtoken";

const generateToken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "10y",
    });
    return token;
  } catch (error) {
    return res.status(500).json(`generation token error ${error}`);
  }
};

export default generateToken;
