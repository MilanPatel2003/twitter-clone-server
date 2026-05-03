import express from "express"
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/users.routes";
import tweetRoutes from "../modules/tweets/tweets.routes";
import commentRoutes from "../modules/comments/comments.routes";
import followRoutes from "../modules/follows/follows.routes";
import reactionRoutes from "../modules/reactions/reactions.routes";
import notificationRoutes from "../modules/notifications/notifications.routes";
import retweetRoutes from "../modules/retweets/retweets.routes";
import searchRoutes from "../modules/search/search.routes";

const router = express.Router()

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/tweets", tweetRoutes);
router.use("/retweets", retweetRoutes)
router.use("/comments", commentRoutes);
router.use("/follows", followRoutes);
router.use("/reactions", reactionRoutes);
// router.use("/notifications", notificationRoutes);
router.use("/search", searchRoutes);

export default router