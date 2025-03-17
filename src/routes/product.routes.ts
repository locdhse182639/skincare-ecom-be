import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  adminGetProducts,
  reactivateProduct,
} from "../controllers/product.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";
import { upload } from "../config/cloudinary";

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product with image upload
 *     tags:
 *       - Products
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The product image to upload
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
 *                 enum: [Cleanser, Moisturizer, Serum, Sunscreen, Toner, Mask]
 *                 example: "Moisturizer"
 *               price:
 *                 type: number
 *                 example: 19.99
 *               stock:
 *                 type: number
 *                 example: 50
 *               skinType:
 *                 type: string
 *                 description: "Send as a comma-separated list (e.g. 'dry,sensitive')"
 *                 example: "dry,sensitive"
 *               ingredients:
 *                 type: string
 *                 description: "Send as a comma-separated list (e.g. 'Hyaluronic Acid,Vitamin E')"
 *                 example: "Hyaluronic Acid,Vitamin E"
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createProduct
);

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
 *         description: Search for products by name, description
 *       - in: query
 *         name: brandName
 *         schema:
 *           type: string
 *         description: Filter by brand name
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
 * /api/products/test:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products for admin with pagination, filtering, and search
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
 *         description: Number of products per page
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Search for products by name, description
 *       - in: query
 *         name: brandName
 *         schema:
 *           type: string
 *         description: Filter by brand name
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
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Include deleted products in the results
 *     responses:
 *       200:
 *         description: A list of filtered and paginated products for admin
 */
router.get("/admin",authMiddleware, adminMiddleware, adminGetProducts);

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
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

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
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

/**
 * @swagger
 * /api/products/{id}/reactivate:
 *   put:
 *     summary: Reactivate a soft-deleted product
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
 *           example: "603e2f84a357dc002f6e1bff"
 *     responses:
 *       200:
 *         description: Product reactivated successfully
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id/reactivate",
  authMiddleware,
  adminMiddleware,
  reactivateProduct
);

export default router;
