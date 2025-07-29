const jwt = require("jsonwebtoken");
const generateAccessToken = async (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });
  return token;
};
const generateRefreshToken = async (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
  return token;
};

module.exports = { generateAccessToken, generateRefreshToken };
