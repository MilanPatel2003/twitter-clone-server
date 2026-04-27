import express from "express"
import { getCurrentUser, login, register } from "./auth.controller"
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
export default router