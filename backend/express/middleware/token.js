const jwt = require("jsonwebtoken");
const secretKey = "SecretKey1149";
const token = {};

token.verify = (req, res, next) => {
  const token = req.header("Authorization") || " ";
  console.log("Received token:", token);

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token.slice(7), secretKey);
    console.log("Decoded token payload:", decoded);

    if (!decoded || !decoded.email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    } else {
      req.decoded = decoded;
      next();
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = token;



