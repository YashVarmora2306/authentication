import { Router } from "express";
import { loginUserValidator, registerUserValidator } from "../validators/auth.js";
import { limiter, protect, validateRequest } from "../middlewares/index.js";
import { getProfile, loginUser, registerUser } from "../controllers/auth.js";

const router = Router();

router.post("/register", registerUserValidator, validateRequest, limiter, registerUser);
router.post("/login", loginUserValidator, validateRequest, limiter, loginUser);
router.get("/profile", protect, getProfile);

export default router;