import express from "express";
import { verifyToken } from "../../middlewares/auth.middleware";
import {
  createComment,
  deleteComment,
  getCommentsByTweet,
  getCommentsReply,
  replyToComment,
} from "./comment.controller";

const router = express.Router();

// POST   /api/comments/:tweetId         → createComment
// POST   /api/comments/reply/:commentId → replyToComment
// GET    /api/comments/tweet/:tweetId   → getCommentsByTweet
// GET    /api/comments/reply/:commentId   getCommentsReply
// DELETE /api/comments/:id              → deleteComment

router.post("/:tweetId", verifyToken, createComment);
router.post("/reply/:tweetId", verifyToken, replyToComment);
router.get("/tweet/:tweetId", verifyToken, getCommentsByTweet);
router.get("/reply/:commentId", verifyToken, getCommentsReply);
router.delete("/:id", verifyToken, deleteComment);

export default router;
