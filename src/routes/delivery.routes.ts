import express from "express";
import {
  createDeliveryForOrder,
  markOrderAsShipping,
  confirmOrderReceived,
  markDeliveryAsShipped,
} from "../controllers/delivery.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /api/deliveries/{orderId}:
 *   post:
 *     summary: Create a delivery for an order
 *     tags:
 *       - Deliveries
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       201:
 *         description: Delivery created successfully
 */
router.post(
  "/:orderId",
  authMiddleware,
  adminMiddleware,
  createDeliveryForOrder
);

/**
 * @swagger
 * /api/deliveries/{orderId}/shipping:
 *   put:
 *     summary: Mark an order as shipping
 *     tags:
 *       - Deliveries
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order marked as shipping
 */
router.put(
  "/:orderId/shipping",
  authMiddleware,
  adminMiddleware,
  markOrderAsShipping
);

/**
 * @swagger
 * /api/deliveries/{orderId}/confirm:
 *   put:
 *     summary: Confirm receipt of an order and add points to the user
 *     tags: [Deliveries]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order confirmed as received and points added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order confirmed as received"
 *                 delivery:
 *                   type: object
 *                   description: Delivery details
 *                 pointsAdded:
 *                   type: number
 *                   example: 10
 *                 totalPoints:
 *                   type: number
 *                   example: 100
 *       403:
 *         description: Unauthorized user
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error confirming order receipt
 */
router.put("/:orderId/confirm", authMiddleware, confirmOrderReceived);
/**
 * @swagger
 * /api/deliveries/{orderId}/mark-shipped:
 *   put:
 *     summary: Mark order as shipped
 *     tags:
 *       - Deliveries
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order confirmed as received
 *       404:
 *         description: Order not found
 */
router.put(
  "/:orderId/mark-shipped",
  authMiddleware,
  adminMiddleware,
  markDeliveryAsShipped
);

export default router;
