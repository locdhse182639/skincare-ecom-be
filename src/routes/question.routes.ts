import express from "express";
import {
  askQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
  restoreQuestion,
} from "../controllers/question.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: API quản lý câu hỏi của khách hàng
 */

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Khách hàng đặt câu hỏi
 *     tags: [Questions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: Nội dung câu hỏi của khách hàng
 *     responses:
 *       201:
 *         description: Câu hỏi đã được tạo thành công
 *       401:
 *         description: Chưa đăng nhập
 *       500:
 *         description: Lỗi server
 */
router.post("/", authMiddleware, askQuestion);

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Lấy danh sách câu hỏi (chỉ hiển thị câu hỏi chưa bị xóa)
 *     tags: [Questions]
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi server
 */
router.get("/", getAllQuestions);

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Chỉnh sửa câu hỏi của khách hàng
 *     tags: [Questions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của câu hỏi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: Nội dung mới của câu hỏi
 *     responses:
 *       200:
 *         description: Câu hỏi đã được cập nhật
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền chỉnh sửa câu hỏi của người khác
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", authMiddleware, updateQuestion);

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Xóa câu hỏi của khách hàng (soft delete)
 *     tags: [Questions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của câu hỏi cần xóa
 *     responses:
 *       200:
 *         description: Câu hỏi đã bị xóa
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền xóa câu hỏi của người khác
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", authMiddleware, deleteQuestion);

/**
 * @swagger
 * /api/questions/{id}/restore:
 *   put:
 *     summary: Khôi phục câu hỏi của khách hàng
 *     tags: [Questions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của câu hỏi cần khôi phục
 *     responses:
 *       200:
 *         description: Câu hỏi đã được khôi phục
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền khôi phục câu hỏi của người khác
 *       500:
 *         description: Lỗi server
 */
router.put("/:id/restore", authMiddleware, restoreQuestion);

export default router;
