import { Router } from "express";
import { loginUserValidator, registerUserValidator, resetPasswordValidator } from "../validators/auth";
import { protect, upload, validateRequest } from "../middlewares";
import { forgotPassword, getProfile, loginUser, registerUser, resetPassword, verifyEmail } from "../controllers/auth";

const router = Router();

router.post("/register", upload.single("profilePicture"), registerUserValidator, validateRequest, registerUser);

router.post("/login", loginUserValidator, validateRequest, loginUser);

router.get("/verify-email/:token", verifyEmail)

router.put("/resetPassword", resetPasswordValidator
    , validateRequest, protect, resetPassword);

router.post("/forgotPassword", forgotPassword)

router.get("/profile", protect, getProfile)

export default router;