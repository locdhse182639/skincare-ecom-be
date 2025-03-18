import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  restoreBlog
} from "../controllers/blog.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: API quản lý bài viết blog
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Tạo blog mới
 *     tags: [Blog]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - excerpt
 *               - description
 *               - content
 *               - image
 *               - link
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề của blog
 *               excerpt:
 *                 type: string
 *                 description: Đoạn mô tả ngắn của blog
 *               description:
 *                 type: string
 *                 description: Mô tả chi tiết của blog
 *               content:
 *                 type: string
 *                 description: Nội dung chi tiết của blog
 *               image:
 *                 type: string
 *                 description: Đường dẫn ảnh đại diện của blog
 *               link:
 *                 type: string
 *                 description: Link tham khảo chi tiết của blog
 *     responses:
 *       201:
 *         description: Tạo blog thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.post("/", authMiddleware, createBlog);

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Lấy danh sách tất cả blog
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: Danh sách các blog
 */
router.get("/", getAllBlogs);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Lấy chi tiết blog theo ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của blog cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông tin blog
 *       404:
 *         description: Không tìm thấy blog
 */
router.get("/:id", getBlogById);

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Cập nhật blog
 *     tags: [Blog]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của blog cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog đã được cập nhật
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy blog
 */
router.put("/:id", authMiddleware, updateBlog);

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Xóa blog (soft delete)
 *     tags: [Blog]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của blog cần xóa
 *     responses:
 *       200:
 *         description: Blog đã được xóa mềm
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy blog
 */
router.delete("/:id", authMiddleware, deleteBlog);

/**
 * @swagger
 * /api/blogs/{id}/restore:
 *   put:
 *     summary: Khôi phục blog đã xóa mềm
 *     tags: [Blog]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của blog cần khôi phục
 *     responses:
 *       200:
 *         description: Blog đã được khôi phục
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy blog
 */
router.put("/:id/restore", authMiddleware, restoreBlog);

export default router;
