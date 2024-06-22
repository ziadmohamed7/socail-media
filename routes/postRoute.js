import express from "express";
import {
  createPost,
  deletePost,
  dislikePost,
  getTimeLinePosts,
  getUserPosts,
  likePost,
  updatePost,
} from "../controllers/postController.js";
import { createPostValidation } from "../validators/postValidator.js";

const router = express.Router();

router.get("/all", getTimeLinePosts);
router.get("/userPosts", getUserPosts);
router.post("/create", createPostValidation, createPost);
router.put("/update/:postId", updatePost);
router.delete("/delete/:postId", deletePost);
router.post("/like/:postId", likePost);
router.post("/dislike/:postId", dislikePost);

export default router;
