import express, { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  refresh,
  logout,
  resetPassword,
  sendResetPasswordForm,
  confirmResetPassword,
} from "../controllers/authController";
import { verifyToken } from "../middlewares/jwtVerify";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: register a new account
 *     description: you have to fill in three fields - email, password and username , with validation
 *     responses:
 *       '200':
 *         description: Successful registration, returns an access token , then user datas send to localStorage
 *          and getting from user page to show user datas
 *       '500':
 *         description: Server error
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: login to user account with credentials
 *     description: you have to fill in two fields - email, password , with validation
 *     responses:
 *       '200':
 *         description: Successful login, returns an access token , then user datas send to localStorage
 *          and getting from user page to show user datas
 *       '401':
 *         description: Unauthorized, invalid credentials
 *       '500':
 *         description: Server error
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: refresh tokens
 *     description: if request's response is 401 tokens will be refreshed
 */
router.post("/refresh", refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: logout from the user account
 *     description: local storage will be emptied , tokens will be deleted and users will be redirected to guest page
 */
router.post("/logout", verifyToken, logout);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: send reset password message 
 *     description: to send reset password message to the email after checking that email exists
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/send-reset-password/:userId/:token:
 *   get:
 *     summary: redirecting to the recovery page
 *     description: open the link we'll send to user , they will be redirected to the recovery page
 */
router.get("/send-reset-password/:userId/:token", sendResetPasswordForm);

/**
 * @swagger
 * /api/auth/send(confirm)-reset-password/:userId/:token:
 *   post:
 *     summary: redirecting to the success page
 *     description: after user fill in the password and reset password fields correctly they'll redirected to the success page
 */
router.post("/send-reset-password/:userId/:token", confirmResetPassword);

export default router;
