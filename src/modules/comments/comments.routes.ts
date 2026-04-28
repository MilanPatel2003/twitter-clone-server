import express from "express"

const router = express.Router()




// POST   /api/comments/:tweetId         → createComment
// POST   /api/comments/reply/:commentId → replyToComment
// GET    /api/comments/tweet/:tweetId   → getCommentsByTweet
// GET    /api/comments/reply/:commentId   getCommentsReply
// DELETE /api/comments/:id              → deleteComment






export default router