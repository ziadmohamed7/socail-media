import jwt from "jsonwebtoken";
import { User } from "../models/usersModel.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "user not logged in ! " });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    next(error)
  }
};
