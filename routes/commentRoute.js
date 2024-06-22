import express from "express";
import {
  createComment,
  createCommentReplay,
  deleteComment,
  deleteReplayOfComment,
  dislikeComment,
  dislikeCommentReplay,
  getAllCommentsOfPost,
  likeComment,
  likeCommentReplay,
  updateComment,
  updateCommentReplay,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/create", createComment);
router.post("/create/replay/:commentId", createCommentReplay);
router.put("/update/:commentId", updateComment);
router.put("/update/:commentId/replies/:replayId", updateCommentReplay);
router.get("/post/:postId", getAllCommentsOfPost);
router.get("/delete/:commentId", deleteComment);
router.get("/delete/:commentId/replay/:replayId", deleteReplayOfComment);
router.post("/like/:commentId", likeComment);
router.post("/dislike/:commentId", dislikeComment);
router.post("/:commentId/like/replay/:replayId", likeCommentReplay);
router.post("/:commentId/dislike/replay/:replayId", dislikeCommentReplay);

export default router;
