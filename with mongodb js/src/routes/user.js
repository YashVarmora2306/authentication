import { Router } from "express";
import { getProfile, loginUser, registerUser } from "../controllers/auth.js";
import { loginUserValidator, registerUserValidator } from "../validators/auth.js";
import { validateRequest, limiter, protect } from "../middlewares/index.js";

const router = Router();

router.post("/register", registerUserValidator, validateRequest, limiter, registerUser);
router.post("/login", loginUserValidator, validateRequest, limiter, loginUser)
router.get("/profile", protect, getProfile)

export default router;