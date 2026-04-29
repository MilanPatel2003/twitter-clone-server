import express from "express"
import { followUser, getFollowers, getFollowing, unfollowUser } from "./follows.controller"

const router = express.Router()



// POST   /api/follows/:userId              → followUser
// DELETE /api/follows/:userId              → unfollowUser
// GET    /api/follows/:userId/followers    → getFollowers
// GET    /api/follows/:userId/following    → getFollowing

router.post("/:userId",followUser)
router.delete("/:userId",unfollowUser)
router.get("/:userId/followers",getFollowers)
router.get("/:userId/following",getFollowing)


export default router 