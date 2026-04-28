import express from "express"

const router = express.Router()



// POST   /api/follows/:userId              → followUser
// DELETE /api/follows/:userId              → unfollowUser
// GET    /api/follows/:userId/followers    → getFollowers
// GET    /api/follows/:userId/following    → getFollowing

export default router 