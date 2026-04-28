import express from "express"
import { likeTweet } from "./reactions.controller"
import { verifyToken } from "../../middlewares/auth.middleware"

const router = express.Router()

// POST   /api/reactions/tweets/:tweetId     → likeTweet
// DELETE /api/reactions/tweets/:tweetId     → unlikeTweet

// POST   /api/reactions/comments/:commentId → likeComment
// DELETE /api/reactions/comments/:commentId → unlikeComment

router.post("/tweets/:tweetId",verifyToken,likeTweet)


export default router