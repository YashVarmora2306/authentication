import { Router } from "express";
import { getProfile, loginUser, registerUser } from "../controllers/auth.js";
import { loginUserValidator, registerUserValidator } from "../validators/auth.js";
import { validateRequest, limiter, protect, upload } from "../middlewares/index.js";

const router = Router();

router.post("/register", limiter, upload.single('profilePicture'), registerUserValidator, validateRequest,  registerUser);
router.post("/login", loginUserValidator, validateRequest, limiter, loginUser)
router.get("/profile", protect, getProfile)

export default router;