import express from "express";
import {
  createFAQ,
  getAllFAQs,
  updateFAQ,
  deleteFAQ,
  restoreFAQ,
} from "../controllers/FAQ.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: FAQ
 *   description: API quản lý các câu hỏi thường gặp
 */

/**
 * @swagger
 * /api/faqs:
 *   post:
 *     summary: Tạo một FAQ (admin hoặc staff)
 *     tags: [FAQ]
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
 *               - content
 *             properties:
 *               question:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post("/", authMiddleware, createFAQ);

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: Lấy tất cả các FAQ (công khai)
 *     tags: [FAQ]
 *     responses:
 *       200:
 *         description: Danh sách FAQ
 */
router.get("/", getAllFAQs);

/**
 * @swagger
 * /api/faqs/{id}:
 *   put:
 *     summary: Cập nhật FAQ (admin hoặc staff)
 *     tags: [FAQ]
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
 *               question:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/:id", authMiddleware, updateFAQ);

/**
 * @swagger
 * /api/faqs/{id}:
 *   delete:
 *     summary: Xóa FAQ (soft delete, admin/staff)
 *     tags: [FAQ]
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
 *         description: Xóa thành công
 */
router.delete("/:id", authMiddleware, deleteFAQ);

/**
 * @swagger
 * /api/faqs/{id}/restore:
 *   put:
 *     summary: Khôi phục FAQ (admin/staff)
 *     tags: [FAQ]
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
 *         description: Khôi phục thành công
 */
router.put("/:id/restore", authMiddleware, restoreFAQ);

export default router;
