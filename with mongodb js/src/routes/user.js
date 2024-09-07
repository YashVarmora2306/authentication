import { Router } from "express";
import { getProfile, loginUser, registerUser, verifyEmail } from "../controllers/auth.js";
import { loginUserValidator, registerUserValidator } from "../validators/auth.js";
import { validateRequest, protect, upload } from "../middlewares/index.js";

const router = Router();

router.post("/register", upload.single('profilePicture'), registerUserValidator, validateRequest, registerUser);

router.post("/login", loginUserValidator, validateRequest, loginUser)

router.get("/verify-email/:token", verifyEmail)

router.get("/profile", protect, getProfile)

export default router;