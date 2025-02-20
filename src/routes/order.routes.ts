import express from "express";
import { createOrder, getOrderById, getUserOrders } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "603e2f84a357dc002f6e1bff"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 29.99
 *               totalAmount:
 *                 type: number
 *                 example: 59.98
 *               paymentMethod:
 *                 type: string
 *                 enum: ["Stripe", "PayPal", "VNPay"]
 *                 example: "Stripe"
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     example: "John Doe"
 *                   street:
 *                     type: string
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     example: "New York"
 *                   province:
 *                     type: string
 *                     example: "NY"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post("/", authMiddleware, createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "65d4f1a2b75b9a001fb2a5c8"
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 */
router.get("/:id", authMiddleware, getOrderById);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       404:
 *         description: No orders found
 */
router.get("/", authMiddleware, getUserOrders);


export default router;
