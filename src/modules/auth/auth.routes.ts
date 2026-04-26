import express from "express"
import { getCurrentUser, login, register } from "./auth.controller"
import { validate } from "../../middlewares/validate.middleware"
import { registerSchema } from "./auth.validate"
import { verifyToken } from "../../middlewares/auth.middleware"

const router = express.Router()


router.post("/login",login)
router.post("/register",[validate(registerSchema)],register)
router.get("/me", verifyToken,getCurrentUser)
export default router