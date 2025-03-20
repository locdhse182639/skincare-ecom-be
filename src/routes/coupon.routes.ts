import express from "express";
import { redeemCoupon, getUserCoupons, getAllUserCoupons } from "../controllers/coupon.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
/**
 * @swagger
 * /api/coupons/redeem:
 *   post:
 *     summary: Redeem points for a coupon
 *     tags: [Coupons]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               points:
 *                 type: number
 *                 example: 100
 *               discount:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Coupon redeemed successfully
 *       400:
 *         description: Invalid input or insufficient points
 *       404:
 *         description: User not found
 */
router.post("/redeem", authMiddleware, redeemCoupon); // Redeem points for a coupon

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Get all coupons for the authenticated user
 *     tags: [Coupons]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user coupons
 *       404:
 *         description: No coupons found
 */
router.get("/", authMiddleware, getUserCoupons); // Get user coupons

/**
 * @swagger
 * /api/coupons/user/{userId}:
 *   get:
 *     summary: Get all coupons for a specific user (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user coupons
 *       404:
 *         description: No coupons found for this user
 */
router.get("/user/:userId", authMiddleware, adminMiddleware, getAllUserCoupons); // Admin: Get all coupons for a user

export default router;