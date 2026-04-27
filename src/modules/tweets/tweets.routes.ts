import express from "express"
import { createTweet } from "./tweets.controller"
import { verifyToken } from "../../middlewares/auth.middleware"
import { upload } from "../../middlewares/upload.middleware"

const router = express.Router()


// POST   /api/tweets                  → createTweet
// GET    /api/tweets/feed             → getFeedTweets
// GET    /api/tweets/trending         → getTrendingTweets
// GET    /api/tweets/:id              → getTweetById
// GET    /api/tweets/user/:userId     → getTweetsByUser
// DELETE /api/tweets/:id              → deleteTweet


router.post("/",verifyToken,upload.single("media"),createTweet)

export default router