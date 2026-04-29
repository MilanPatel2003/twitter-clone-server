import express from "express"
import { upload } from "../../middlewares/upload.middleware"
import { deleteCoverImage, deleteProfileImage, getUserLikes, getUserProfile, getUserTweets, updateCoverImage, updateUserProfile, uploadProfile } from "./user.controller"
import { verifyToken } from "../../middlewares/auth.middleware"

const router = express.Router()
// GET    /api/users/:username            → getUserProfile
// GET    /api/users/:username/tweets     → getUserTweets
// GET    /api/users/:username/replies    → getUserReplies
// GET    /api/users/:username/likes      → getUserLikes

// PUT    /api/users/profile              → updateUserProfile
// PUT    /api/users/profile-image        → updateProfileImage
// PUT    /api/users/cover-image          → updateCoverImage

// DELETE /api/users/profile-image        → deleteProfileImage
// DELETE /api/users/cover-image          → deleteCoverImage



router.get("/:username",verifyToken,getUserProfile)
router.get("/:username/tweets",verifyToken,getUserTweets)
router.get("/:username/likes", verifyToken,getUserLikes)
router.put("/profile-image",verifyToken,upload.single("profile_pic"),uploadProfile)
router.put("/cover-image",verifyToken, upload.single("cover_image"),updateCoverImage)
router.delete("/profile-image",verifyToken,deleteProfileImage)
router.delete("/cover-image",verifyToken,deleteCoverImage)
router.put("/profile",verifyToken,updateUserProfile)

export default router
