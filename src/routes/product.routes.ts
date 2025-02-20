import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Hydrating Moisturizer"
 *               description:
 *                 type: string
 *                 example: "A lightweight moisturizer for all skin types."
 *               brand:
 *                 type: string
 *                 example: "BrandX"
 *               category:
 *                 type: string
 *                 enum: [cleanser, moisturizer, serum, sunscreen, toner, mask]
 *                 example: "moisturizer"
 *               price:
 *                 type: number
 *                 example: 19.99
 *               stock:
 *                 type: number
 *                 example: 50
 *               skinType:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [oily, dry, combination, sensitive, normal]
 *                 example: ["dry", "sensitive"]
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Hyaluronic Acid", "Vitamin E"]
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", authMiddleware, createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with pagination, filtering, and search
 *     tags:
 *       - Products
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
 *         description: Number of products per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search for products by name, description, or brand
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category (Cleanser, Moisturizer, Serum, Sunscreen, Toner, Mask)
 *       - in: query
 *         name: skinType
 *         schema:
 *           type: string
 *         description: Filter by skin type (oily, dry, combination, sensitive, all)
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: A list of filtered and paginated products
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags:
 *       - Products
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
 *               name:
 *                 type: string
 *                 example: "Updated Moisturizer"
 *               price:
 *                 type: number
 *                 example: 24.99
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put("/:id", authMiddleware, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Soft delete a product
 *     tags:
 *       - Products
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
 *         description: Product deleted successfully (soft delete)
 *       404:
 *         description: Product not found
 *       400:
 *         description: Product already deleted
 */
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
