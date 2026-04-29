import express from "express"
import { createTweet, deleteTweet, getFeedTweets, getTweetById, getTweetsByUser } from "./tweets.controller"
import { verifyToken } from "../../middlewares/auth.middleware"
import { upload } from "../../middlewares/upload.middleware"
import { get } from "node:http"

const router = express.Router()


// POST   /api/tweets                  → createTweet
// GET    /api/tweets/feed             → getFeedTweets
// GET    /api/tweets/:id              → getTweetById
// GET    /api/tweets/user/:userId     → getTweetsByUser
// DELETE /api/tweets/:id              → deleteTweet


router.post("/",verifyToken,upload.single("media"),createTweet)

router.get("/feed", verifyToken,getFeedTweets)
router.get("/:id",verifyToken,getTweetById)
router.get("/user/:userId",verifyToken,getTweetsByUser)
router.delete("/:id", verifyToken,deleteTweet)
export default router