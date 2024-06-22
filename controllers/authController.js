import asyncHandler from "express-async-handler";
import { User } from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { customError } from "../middlewares/error.js";


const generateToken = (userId) =>
  jwt.sign({ userId: userId }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRED_IN,
  });
  

export const register = (async (req, res,next) => {

  const { email, username, password, fullName } = req.body;
  try {
    const checkUser = await User.findOne({ $or:[{email} , {username}] });
    if (checkUser) {
      throw new customError("User already exist,try login... ", 404);
    }

    const user = await User.create({
      username: username,
      email: email,
      fullName: fullName,
      password: password,
    });

    res
      .status(201)
      .json({ data: user });
  } catch (error) {
    next(error)
  }
});

export const login = async (req, res, next) => {
  const { email, username, password } = req.body;
  let user;
  
  try {
    if (!password || (!email && !username)) {
      throw new customError(
        "Email or username and password are required.",
        400
      );
    }

    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ username });
    }

    if (!user) {
      throw new customError("User not found.", 404);
    }

    const checkPassword =await bcrypt.compare(req.body.password, user.password);
    if (!checkPassword) {
      throw new customError("Incorrect email or password.", 401);
    }

    const token = generateToken(user._id);

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res,next) =>{

  try {
    res
      .clearCookie("accessToken", {
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json("user has been logged out..");
    
  } catch (error) {
    next(error)
  }
};

