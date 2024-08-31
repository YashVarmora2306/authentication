import { Router } from "express";
import { loginUserValidator, registerUserValidator } from "../validators/auth";
import { limiter, protect, upload, validateRequest } from "../middlewares";
import { getProfile, loginUser, registerUser } from "../controllers/auth";

const router = Router();

router.post("/register", upload.single("profilePicture"),registerUserValidator, validateRequest, limiter, registerUser);
router.post("/login", loginUserValidator, validateRequest, limiter, loginUser)
router.get("/profile", limiter ,protect, getProfile)

export default router;