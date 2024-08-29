import { Router } from "express";
import authRoutes from "./user.js"

const router = Router();

router.use('/auth', authRoutes);

export default router;