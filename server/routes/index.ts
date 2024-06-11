import express from "express";
import authRouter from "./authRoutes";
import googleAuthRoutes from "./googleAuthRoutes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/oauth", googleAuthRoutes);

export default router;
