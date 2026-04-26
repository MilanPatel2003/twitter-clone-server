import express from "express"
import { upload } from "../../middlewares/upload.middleware"
import { uploadProfile } from "./user.controller"

const router = express.Router()


router.put("/profile-image/:id",upload.single("profile_pic"),uploadProfile)
export default router