import { Router } from "express";
import { forgotPassword, getProfile, loginUser, registerUser, resetPassword, verifyEmail } from "../controllers/auth.js";
import { loginUserValidator, registerUserValidator, resetPasswordValidator } from "../validators/auth.js";
import { validateRequest, protect, upload } from "../middlewares/index.js";

const router = Router();

router.post("/register", upload.single('profilePicture'), registerUserValidator, validateRequest, registerUser);

router.post("/login", loginUserValidator, validateRequest, loginUser)

router.get("/verify-email/:token", verifyEmail)

router.put("/resetPassword", resetPasswordValidator, validateRequest, protect, resetPassword);

router.post("/forgotPassword",forgotPassword)

router.get("/profile", protect, getProfile)

export default router;