import express from "express";
import{
    getAllFeedbacks,
    deleteFeedback,
    restoreFeedback,
    filterFeedbacks
} from "../controllers/feedback.management.controller";

import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
/**
 * @swagger
 * /api/admin/feedbacks:
 *   get:
 *     summary: Lấy tất cả phản hồi (Chỉ dành cho Admin)
 *     tags: [Admin - Feedback Management]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tất cả phản hồi
 */
router.get("/", authMiddleware, adminMiddleware, getAllFeedbacks);

/**
 * @swagger
 * /api/admin/feedbacks/{id}:
 *   delete:
 *     summary: Xóa vĩnh viễn phản hồi (Chỉ dành cho Admin)
 *     tags: [Admin - Feedback Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phản hồi
 *     responses:
 *       200:
 *         description: Phản hồi đã bị xóa vĩnh viễn
 */

router.delete("/:id", authMiddleware, adminMiddleware, deleteFeedback);
/**
 * @swagger
 * /api/admin/feedbacks/{id}/restore:
 *   put:
 *     summary: Khôi phục phản hồi bị xóa (Chỉ dành cho Admin)
 *     tags: [Admin - Feedback Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phản hồi
 *     responses:
 *       200:
 *         description: Phản hồi đã được khôi phục
 */
router.put("/:id/restore", authMiddleware, adminMiddleware, restoreFeedback);

/**
 * @swagger
 * /api/admin/feedbacks/filter:
 *   get:
 *     summary: Lọc phản hồi theo sản phẩm hoặc người dùng (Chỉ dành cho Admin)
 *     tags: [Admin - Feedback Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Danh sách phản hồi đã được lọc
 */
router.get("/filter", authMiddleware, adminMiddleware, filterFeedbacks);

export default router;