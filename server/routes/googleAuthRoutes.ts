import express from "express";
import passport from "passport";
import {
  handleGoogleCallback,
  handleFailedLogin,
  getUserByEmail,
} from "../controllers/googleAuthController";
import { verifyToken } from "../middlewares/jwtVerify";

const router = express.Router();

/**
 * @swagger
 * /api/oauth/auth/google:
 *   get:
 *     summary: google auth
 *     description: google authtenticate
 */
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /api/oauth/auth/google/callback:
 *   get:
 *     summary: login with google
 *     description: send cookies to the user page
 */
router.get("/auth/google/callback", handleGoogleCallback);

/**
 * @swagger
 * /api/oauth/login/failed:
 *   get:
 *     summary: failed to auth with google
 */
router.get("/login/failed", handleFailedLogin);

/**
 * @swagger
 * /api/oauth/get-user:
 *   get:
 *     summary: login with google
 *     description: send cookies to the user page
 */
router.get("/get-user", verifyToken, getUserByEmail);

export default router;
