import express from "express"
import { followUser, getFollowers, getFollowing, unfollowUser } from "./follows.controller"
import { verifyToken } from "../../middlewares/auth.middleware"

const router = express.Router()



// POST   /api/follows/:userId              → followUser
// DELETE /api/follows/:userId              → unfollowUser
// GET    /api/follows/:userId/followers    → getFollowers
// GET    /api/follows/:userId/following    → getFollowing

router.post("/:userId",verifyToken,followUser)
router.delete("/:userId",verifyToken,unfollowUser)
router.get("/:userId/followers",verifyToken,getFollowers)
router.get("/:userId/following",verifyToken,getFollowing)


export default router 