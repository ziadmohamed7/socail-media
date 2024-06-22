import { User } from "../models/usersModel.js";
import { customError } from "../middlewares/error.js";

export const getUser = async (req, res,next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new customError("user not found ", 404);
    }
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!user) {
      throw new customError("user not found to update !", 404);
    }
    res.status(200).json({ updatedUser: user });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;
  try {
    if (userId === _id) {
      throw new customError("it not possible to follow yourself ", 400);
    }

    const userToFollow = await User.findById(userId);
    const loggedUser = await User.findById(_id);

    if (!userToFollow || !loggedUser) {
      throw new customError("users not found , enter correct id", 400);
    }

    if (loggedUser.following.includes(userId)) {
      throw new customError("User already followed ", 400);
    }
    userToFollow.followers.push(_id);
    loggedUser.following.push(userId);

    await userToFollow.save();
    await loggedUser.save();

    res.status(200).json({ message: "successfully followed user " });
  } catch (error) {
    next(error);
  }
};

export const unFollowUser = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id) {
      throw new customError("can not unFollow yourself", 400);
    }
    const userToUnFollow = await User.findById(userId);
    const loggedUser = await User.findById(_id);

    if (!userToUnFollow || !loggedUser) {
      throw new customError("user not found ", 400);
    }

    if (!loggedUser.following.includes(userId)) {
      throw new customError("user already unFollow ", 400);
    }

    // make filter on array to get all ids except userId and _id
    userToUnFollow.followers = userToUnFollow.followers.filter(
      (followerId) => followerId.toString() !== _id
    );
    loggedUser.following = loggedUser.following.filter(
      (followingId) => followingId.toString() !== userId
    );

    await userToUnFollow.save();
    await loggedUser.save();

    res.status(200).json({ message: "User unFollowed successfully." });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;
  try {
    if (userId === _id) {
      throw new customError("you cant block yourself!", 400);
    }

    const loggedUser = await User.findById(_id);

    if (!loggedUser) {
      throw new customError("user not found ", 400);
    }

    if (loggedUser.blackList.includes(userId)) {
      throw new customError("user already blocked !", 400);
    }

    loggedUser.blackList.push(userId);

    await loggedUser.save();

    res.status(200).json({ message: "user blocked successfully " });
  } catch (error) {
    next(error);
  }
};

export const unBlockedUser = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;

  try {
    if (userId === _id) {
      throw new customError("you can't unBlock yourself", 400);
    }

    const loggedUser = await User.findById(_id);
    if (!loggedUser) {
      throw new customError("user not found ", 400);
    }

    loggedUser.blackList = loggedUser.blackList.filter(
      (blackedId) => blackedId.toString() != userId
    );

    await loggedUser.save();

    res.status(200).json({ message: "user unBlocked successfully " });
  } catch (error) {
    next(error);
  }
};

export const getBlockedUsers = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      throw new customError("user id is required", 400);
    }

    const loggedUser = await User.findById(userId);
    if (!loggedUser) {
      throw new customError("user not found ", 400);
    }

    const blockedUserList = loggedUser.blackList;
    res.status(200).json({ blockedList: blockedUserList });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      throw new customError("user id is required ", 400);
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new customError("user not found ", 400);
    }

    res
      .status(200)
      .json({ message: "user deleted successfully", deletedUser: deletedUser });
  } catch (error) {
    next(error);
  }
};


