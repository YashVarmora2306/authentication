import { Router } from "express";
import authRoutes from "./user"

const router = Router();

router.use('/auth', authRoutes);

export default router;