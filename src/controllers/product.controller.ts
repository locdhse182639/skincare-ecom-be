import { Request, Response } from "express";
import { ProductModel } from "../models/product.model";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = new ProductModel(req.body);
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    let { page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const products = await ProductModel.find({ isDeleted: false })
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await ProductModel.countDocuments({
      isDeleted: false,
    });
    const totalPages = Math.ceil(totalProducts / limitNumber);
    res.json({
      products,
      totalProducts,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product", error: err });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product || product.isDeleted)
      return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    await product.save();

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.isDeleted)
      return res.status(404).json({ message: "Product already deleted" });

    product.isDeleted = true;
    await product.save();

    res.json({
      message: "Product deleted successfully (soft delete)",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err });
  }
};
