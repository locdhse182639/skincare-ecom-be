import express from "express";
import { 
  createFeedback, 
  updateFeedback, 
  deleteFeedback, 
  getFeedbacksByProduct 
} from "../controllers/feedback.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Create a new feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *               - comment
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating between 1 and 5
 *               comment:
 *                 type: string
 *                 description: Feedback comment
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Feedback'
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *       404:
 *         description: Product not found
 */
router.post("/", authMiddleware, createFeedback);

/**
 * @swagger
 * /api/feedback/{id}:
 *   put:
 *     summary: Update a feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating between 1 and 5
 *               comment:
 *                 type: string
 *                 description: Updated feedback comment
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Feedback'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to update this feedback
 *       404:
 *         description: Feedback not found
 */
router.put("/:id", authMiddleware, updateFeedback);

/**
 * @swagger
 * /api/feedback/{id}:
 *   delete:
 *     summary: Delete a feedback (soft delete)
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Feedback deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this feedback
 *       404:
 *         description: Feedback not found
 */
router.delete("/:id", authMiddleware, deleteFeedback);

/**
 * @swagger
 * /api/feedback/product/{productId}:
 *   get:
 *     summary: Get all feedbacks for a product
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of feedbacks for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feedback'
 *       500:
 *         description: Server error
 */
router.get("/product/:productId", getFeedbacksByProduct);

/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Feedback ID
 *         userId:
 *           type: string
 *           description: ID of the user who created the feedback
 *         productId:
 *           type: string
 *           description: ID of the product
 *         rating:
 *           type: number
 *           description: Rating between 1 and 5
 *         comment:
 *           type: string
 *           description: Feedback comment
 *         isDeleted:
 *           type: boolean
 *           description: Soft delete status
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router; 