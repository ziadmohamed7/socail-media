import express from "express";
import {} from "../controllers/commentController.js";
import { upload } from "../middlewares/upload.js";
import {
  createStory,
  deleteStory,
  deleteUserStories,
  getTimeLineStories,
  getUserStories,
} from "../controllers/storyController.js";

const router = express.Router();

router.post("/create/:userId", upload.single("img"), createStory);
router.get("/all", getTimeLineStories);
router.get("/user/stories", getUserStories);
router.delete("/delete/:storyId", deleteStory);
router.delete("/delete/user/:userId", deleteUserStories);

export default router;
