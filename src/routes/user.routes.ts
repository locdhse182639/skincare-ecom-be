import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  getAllUser,
  updateUser,
  banUser,
  unbanUser,
} from "../controllers/user.controller";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware"; // Ensure routes are protected

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
router.get("/profile", authMiddleware, getUserProfile);

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
router.put("/profile", authMiddleware, updateUserProfile);

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
router.put("/change-password", authMiddleware, changeUserPassword);
/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: Get all users with role-based filtering
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by user name (case-insensitive search)
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter by email (case-insensitive search)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, staff, manager]
 *         description: Filter by user role
 *       - in: query
 *         name: isVerified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *       - in: query
 *         name: isBanned
 *         schema:
 *           type: boolean
 *         description: Filter by ban status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *       403:
 *         description: Unauthorized access
 */
router.get("/all", authMiddleware, adminMiddleware, getAllUser);

/**
 * @swagger
 * /api/user/update/{id}:
 *   put:
 *     summary: Update a user's profile
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               skinType:
 *                 type: string
 *                 enum: [oily, dry, combination, sensitive, normal]
 *               address:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   province:
 *                     type: string
 *                   phone:
 *                     type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put("/update/:id", authMiddleware, adminMiddleware, updateUser);

/**
 * @swagger
 * /api/user/ban/{id}:
 *   put:
 *     summary: Ban a user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to ban
 *     responses:
 *       200:
 *         description: User banned successfully
 *       404:
 *         description: User not found
 */
router.put("/ban/:id", authMiddleware, adminMiddleware, banUser);

/**
 * @swagger
 * /api/user/unban/{id}:
 *   put:
 *     summary: Unban a user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to unban
 *     responses:
 *       200:
 *         description: User unbanned successfully
 *       404:
 *         description: User not found
 */
router.put("/unban/:id", authMiddleware, adminMiddleware, unbanUser);

export default router;
