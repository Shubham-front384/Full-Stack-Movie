const jwt = require("jsonwebtoken");
const blackListModel = require("../models/blacklist.model");

const identifyUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
    
    const isBlacklisted = await blackListModel.findOne({ token });

    if (isBlacklisted) {
      const error = new Error("Token is blacklisted");
      error.status = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    const error = new Error("Invalid or expired token.");
    error.status = 401;
    return next(err);
  }
}

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only."
    });
  }
  next();
};

module.exports = { identifyUser, isAdmin };
