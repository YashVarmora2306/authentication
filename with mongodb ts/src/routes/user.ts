import { Router } from "express";
import { loginUserValidator, registerUserValidator } from "../validators/auth";
import {protect, upload, validateRequest } from "../middlewares";
import { getProfile, loginUser, registerUser, verifyEmail } from "../controllers/auth";

const router = Router();

router.post("/register", upload.single("profilePicture"), registerUserValidator, validateRequest, registerUser);

router.post("/login", loginUserValidator, validateRequest, loginUser);

router.get("/verify-email/:token", verifyEmail)

router.get("/profile",protect, getProfile)

export default router;