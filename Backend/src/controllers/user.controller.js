const userModel = require('../models/user.model');
const blackListModel = require("../models/blacklist.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const handleRegisterUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      const error = new Error('All fields are required');
      error.status = 400;
      throw error;
    }

    email = email.toLowerCase();

    const isUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (isUser) {
      const error = new Error('User with this credentials already exists.');
      error.status = 409;
      throw error;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      msg: 'User created successfully.',
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const handleLoginUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      const error = new Error("All fields are required.");
      error.status = 400;
      throw error;
    }

    const isUser = await userModel.findOne({
      $or: [ { username }, { email } ]
    }).select("+password");
    if (!isUser) {
      const error = new Error("You need to register first.");
      error.status = 404;
      throw error;
    }

    const comparePassword = await bcrypt.compare(password, isUser.password);
    if (!comparePassword) {
      const error = new Error("User credential is not correct.");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: isUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      msg: "User login successfully.",
      user: {
        id: isUser._id,
        username: isUser.username,
        email: isUser.email
      }
    });
  } catch (err) {
    next(err);
  }
}

const handleLogoutUser = async (req, res) => {
  const token = req.cookies.token;

  await blackListModel.create({
    token
  });

  res.clearCookie("token");

  res.status(200).json({
    message: "Logout successfully."
  });
}

module.exports = {
  handleRegisterUser,
  handleLoginUser,
  handleLogoutUser
};
