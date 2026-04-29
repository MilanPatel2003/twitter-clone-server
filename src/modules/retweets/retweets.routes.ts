import express from "express"
import { retweetTweet, undoRetweet } from "./retweet.controller"
import { verifyToken } from "../../middlewares/auth.middleware"

const router = express.Router()



// POST   /api/retweets/:tweetId    → retweetTweet
// DELETE /api/retweets/:tweetId    → undoRetweet
router.post("/:tweetId", verifyToken,retweetTweet)
router.delete("/:tweetId",verifyToken,undoRetweet)

export default router