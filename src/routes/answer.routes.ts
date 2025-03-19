import express from "express";
import { createAnswer, updateAnswer, deleteAnswer, restoreAnswer} from "../controllers/answer.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /api/answers:
 *   post:
 *     summary: "Staff/Admin tạo câu trả lời"
 *     tags: [Answer]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - content
 *             properties:
 *               questionId:
 *                 type: string
 *                 description: "ID của câu hỏi"
 *               content:
 *                 type: string
 *                 description: "Nội dung câu trả lời"
 *     responses:
 *       201:
 *         description: "Câu trả lời đã được tạo thành công"
 *       403:
 *         description: "Chỉ Staff/Admin có quyền thêm câu trả lời"
 */
router.post("/", authMiddleware, createAnswer);

/**
 * @swagger
 * /api/answers/{id}:
 *   put:
 *     summary: "Staff/Admin cập nhật câu trả lời"
 *     tags: [Answer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Câu trả lời đã được cập nhật"
 *       403:
 *         description: "Không có quyền cập nhật"
 */
router.put("/:id", authMiddleware, updateAnswer);

/**
 * @swagger
 * /api/answers/{id}:
 *   delete:
 *     summary: "Admin xóa câu trả lời"
 *     tags: [Answer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Câu trả lời đã bị xóa"
 *       403:
 *         description: "Chỉ Admin mới có quyền xóa"
 */
router.delete("/:id", authMiddleware, deleteAnswer);

/**
 * @swagger
 * /api/answers/{id}/restore:
 *   put:
 *     summary: "Admin khôi phục câu trả lời"
 *     tags: [Answer]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Câu trả lời đã được khôi phục"
 */
router.put("/:id/restore", authMiddleware, restoreAnswer);

export default router;
