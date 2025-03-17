import express from "express";
import { createBrand, getAllBrands, updateBrand, deleteBrand, reactivateBrand, adminGetBrands } from "../controllers/brand.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Create a new brand
 *     tags:
 *       - Brands
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandName:
 *                 type: string
 *                 example: "BrandX"
 *     responses:
 *       201:
 *         description: Brand created successfully
 */
router.post("/", authMiddleware, adminMiddleware, createBrand);

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all brands
 *     tags:
 *       - Brands
 *     responses:
 *       200:
 *         description: Successfully retrieved brands
 */
router.get("/", getAllBrands);

/**
 * @swagger
 * /api/brands/{id}:
 *   put:
 *     summary: Update a brand
 *     tags:
 *       - Brands
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the brand to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *       404:
 *         description: Brand not found
 */
router.put("/:id", authMiddleware, adminMiddleware, updateBrand);

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Soft delete a brand
 *     tags:
 *       - Brands
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the brand to delete
 *     responses:
 *       200:
 *         description: Brand deleted successfully (soft delete)
 *       400:
 *         description: Cannot delete brand, it is referenced in products
 *       404:
 *         description: Brand not found
 */
router.delete("/:id", authMiddleware, adminMiddleware, deleteBrand);

/**
 * @swagger
 * /api/brands/{id}/reactivate:
 *   put:
 *     summary: Reactivate a brand
 *     tags:
 *       - Brands
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the brand to reactivate
 *     responses:
 *       200:
 *         description: Brand reactivated successfully
 *       404:
 *         description: Brand not found
 */
router.put("/:id/reactivate", authMiddleware, adminMiddleware, reactivateBrand);

/**
 * @swagger
 * /api/brands/admin:
 *   get:
 *     tags:
 *       - Brands
 *     summary: Get all brands for admin with pagination, filtering, and search
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of brands per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search for brands by name
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Include deleted brands in the results
 *     responses:
 *       200:
 *         description: A list of filtered and paginated brands for admin
 */
router.get("/admin", authMiddleware, adminMiddleware, adminGetBrands);


export default router;