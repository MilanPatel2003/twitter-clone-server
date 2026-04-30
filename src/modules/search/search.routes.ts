import express from "express"
import { verifyToken } from "../../middlewares/auth.middleware";
import { search } from "./search.controller";

const router = express.Router()

router.get("/", verifyToken, search);
export default router