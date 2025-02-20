import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
  cancelOrder
} from "../controllers/order.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

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

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Mark an order as paid
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "pi_123456789"
 *               status:
 *                 type: string
 *                 example: "COMPLETED"
 *               update_time:
 *                 type: string
 *                 example: "2025-02-21T10:00:00Z"
 *               email_address:
 *                 type: string
 *                 example: "customer@example.com"
 *     responses:
 *       200:
 *         description: Order marked as paid
 *       404:
 *         description: Order not found
 */
router.put("/:id/pay", authMiddleware, updateOrderToPaid);

/**
 * @swagger
 * /api/orders/{id}/deliver:
 *   put:
 *     summary: Mark an order as delivered
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order marked as delivered
 *       400:
 *         description: Order must be shipped before marking as delivered
 *       404:
 *         description: Order not found
 */
router.put(
  "/:id/deliver",
  authMiddleware,
  adminMiddleware,
  updateOrderToDelivered
);

/**
 * @swagger
 * /api/orders/admin:
 *   get:
 *     summary: Get all orders with filtering & pagination (Admin only)
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default: 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page (default: 10)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Processing, Shipped, Delivered]
 *         description: Filter orders by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by user email
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       403:
 *         description: Access denied (Admin only)
 */
router.get("/admin", authMiddleware, adminMiddleware, getAllOrders);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancel an order (User or Admin)
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       400:
 *         description: Cannot cancel an order that has already been processed
 *       403:
 *         description: Unauthorized to cancel this order
 *       404:
 *         description: Order not found
 */
router.put("/:id/cancel", authMiddleware, cancelOrder);

export default router;
