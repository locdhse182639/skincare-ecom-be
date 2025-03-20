import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
  getOrderAnalytics,
  createPaymentIntent,
  validateCoupon
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
 *               paymentMethod:
 *                 type: string
 *                 enum: ["Stripe", "VNPay"]
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
 *                   district:
 *                     type: string
 *                     example: "Manhattan"
 *                   province:
 *                     type: string
 *                     example: "NY"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *               couponCode:
 *                 type: string
 *                 example: "A1B2C3D4E5"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 *                 order:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "641e2f8b9d1e4a0012345678"
 *                     user:
 *                       type: string
 *                       example: "641e2f8b9d1e4a0012345678"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             example: "603e2f84a357dc002f6e1bff"
 *                           price:
 *                             type: number
 *                             example: 29.99
 *                           quantity:
 *                             type: number
 *                             example: 2
 *                     totalAmount:
 *                       type: number
 *                       example: 59.98
 *                     paymentMethod:
 *                       type: string
 *                       example: "Stripe"
 *                     shippingAddress:
 *                       type: object
 *                       properties:
 *                         fullName:
 *                           type: string
 *                           example: "John Doe"
 *                         street:
 *                           type: string
 *                           example: "123 Main St"
 *                         city:
 *                           type: string
 *                           example: "New York"
 *                         district:
 *                           type: string
 *                           example: "Manhattan"
 *                         province:
 *                           type: string
 *                           example: "NY"
 *                         phone:
 *                           type: string
 *                           example: "+1234567890"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-20T12:00:00.000Z"
 *       400:
 *         description: Invalid input or coupon
 *       500:
 *         description: Error creating order
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
 *   post:
 *     summary: Create a Stripe PaymentIntent for an order
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
 *         description: PaymentIntent created, returns clientSecret
 *       404:
 *         description: Order not found
 */
router.post("/:id/pay", authMiddleware, createPaymentIntent);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Mark an order as paid after Stripe payment
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
 *               paymentIntentId:
 *                 type: string
 *                 example: "pi_123456789"
 *     responses:
 *       200:
 *         description: Order marked as paid
 *       404:
 *         description: Order not found
 */
router.put("/:id/pay", authMiddleware, updateOrderToPaid);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin Only)
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
 *               orderStatus:
 *                 type: string
 *                 example: "Processing"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid status update
 *       404:
 *         description: Order not found
 */
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

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

/**
 * @swagger
 * /api/orders/admin/analytics:
 *   get:
 *     summary: Get order analytics for admin dashboard
 *     tags:
 *       - Orders
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Order analytics retrieved successfully
 *       403:
 *         description: Unauthorized, only admins can access
 */
router.get(
  "/admin/analytics",
  authMiddleware,
  adminMiddleware,
  getOrderAnalytics
);

/**
 * @swagger
 * /api/orders/admin/getAll:
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
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
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
router.get("/admin/getAll", authMiddleware, adminMiddleware, getAllOrders);

/**
 * @swagger
 * /api/orders/validate-coupon:
 *   post:
 *     summary: Validate a coupon and calculate the discount
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               couponCode:
 *                 type: string
 *                 example: "A1B2C3D4E5"
 *               totalAmount:
 *                 type: number
 *                 example: 100000
 *     responses:
 *       200:
 *         description: Coupon validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Coupon validated successfully"
 *                 discountAmount:
 *                   type: number
 *                   example: 10000
 *                 discountedTotal:
 *                   type: number
 *                   example: 90000
 *       400:
 *         description: Invalid or expired coupon
 *       500:
 *         description: Error validating coupon
 */
router.post("/apply-coupon", authMiddleware, validateCoupon);

export default router;
