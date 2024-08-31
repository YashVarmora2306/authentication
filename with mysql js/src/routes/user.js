import { Router } from "express";
import { loginUserValidator, registerUserValidator } from "../validators/auth.js";
import {protect, upload, validateRequest } from "../middlewares/index.js";
import { getProfile, loginUser, registerUser } from "../controllers/auth.js";

const router = Router();

router.post("/register", upload.single("profilePicture"),registerUserValidator, validateRequest, registerUser);
router.post("/login", loginUserValidator, validateRequest, loginUser);
router.get("/profile", protect, getProfile);

export default router;