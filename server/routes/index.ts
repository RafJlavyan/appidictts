import express from "express";
import authRouter from "./authRoutes";
import googleAuthRoutes from "./googleAuthRoutes";
import userRouter from "./userRoutes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/oauth", googleAuthRoutes);
router.use("/users", userRouter);

export default router;
