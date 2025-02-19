import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
} from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware"; // Ensure routes are protected

const router = express.Router();

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authenticateToken, getUserProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               skinType:
 *                 type: string
 *                 enum: [oily, dry, combination, sensitive, normal]
 *                 example: oily
 *               address:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     example: John Doe
 *                   street:
 *                     type: string
 *                     example: 123 Skincare Ave
 *                   city:
 *                     type: string
 *                     example: Beauty City
 *                   province:
 *                     type: string
 *                     example: Skinland
 *                   phone:
 *                     type: string
 *                     example: "123456789"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", authenticateToken, updateUserProfile);

/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     summary: Change user password
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 example: newSecurePassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Incorrect old password
 *       401:
 *         description: Unauthorized
 */
router.put("/change-password", authenticateToken, changeUserPassword);

export default router;
