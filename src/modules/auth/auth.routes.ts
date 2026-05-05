import express from "express"
import { getCurrentUser, login, register, resetPassword, sendOTP } from "./auth.controller"
import { validate } from "../../middlewares/validate.middleware"
import { registerSchema } from "./auth.validate"
import { verifyToken } from "../../middlewares/auth.middleware"

const router = express.Router()
// POST /api/auth/register        → registerUser
// POST /api/auth/login           → loginUser
// GET  /api/auth/me              → getCurrentUser
// POST /api/auth/logout          → logoutUser
// PUT  /api/auth/password        → updatePassword

router.post("/login",login)
router.post("/register",[validate(registerSchema)],register)
router.get("/me", verifyToken,getCurrentUser)
router.post("/forgot-password", sendOTP);
router.post("/reset-password", resetPassword);
export default router