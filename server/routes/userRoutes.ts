import express, { Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/jwtVerify";
import * as userController from "../controllers/userController";

const router: Router = express.Router();

/**
 * @swagger
 * /api/users/get-user-data/{userId}:
 *   get:
 *     summary: Get user data
 *     description: Retrieve user data by user ID
 */
router.get("/get-user-data/:userId", userController.getUser);

/**
 * @swagger
 * /api/users/update/{userId}:
 *   put:
 *     summary: Update user data
 *     description: Update user data by user ID
 */
router.put("/update/:userId", verifyToken, userController.updateUser);

/**
 * @swagger
 * /api/users/delete/{userId}:
 *   delete:
 *     summary: Delete user data
 *     description: Delete user data by ID
 */
router.delete("/delete/:userId", verifyToken, userController.deleteUser);

/**
 * @swagger
 * /api/users/admin/find/{userId}:
 *   get:
 *     summary: Admin - Find user
 *     description: Find user by ID
 */
router.get("/admin/find/:userId", verifyToken, userController.getUser);

/**
 * @swagger
 * /api/users/admin/get-all-users:
 *   get:
 *     summary: Admin - Get all users
 *     description: Retrieve all users from the database
 */
router.get("/admin/get-all-users", verifyToken, userController.getAllUsers);

/**
 * @swagger
 * /api/users/admin/stats:
 *   get:
 *     summary: Admin - Get user statistics
 *     description: Retrieve user statistics
 */
router.get("/admin/stats", verifyToken, userController.getUserStats);

export default router;