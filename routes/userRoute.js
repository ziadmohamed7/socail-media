import express from "express";
import {
  blockUser,
  deleteUser,
  followUser,
  getBlockedUsers,
  getUser,
  unBlockedUser,
  unFollowUser,
  updateUser,
} from "../controllers/userController.js";
import {
  getUserValidator,
  updateUserValidator,
} from "../validators/userValidator.js";

const router = express.Router();

router.get("/find/:userId", getUserValidator, getUser);
router.post("/update/:userId",updateUserValidator, updateUser);
router.post("/follow/:userId", followUser);
router.post("/unfollow/:userId", unFollowUser);
router.post("/block/:userId", blockUser);
router.post("/unblock/:userId", unBlockedUser);
router.get("/blocklist/:userId", getBlockedUsers);
router.post("/delete/:userId", deleteUser);

export default router;
