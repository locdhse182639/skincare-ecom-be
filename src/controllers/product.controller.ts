import { Request, Response } from "express";
import { ProductModel } from "../models/product.model";
import { BrandModel } from "../models/brand.model";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      stock,
      skinType,
      ingredients,
    } = req.body;
    const imageUrl = req.file?.path;

    if (!imageUrl)
      return res.status(400).json({ message: "Image upload failed" });

    const parseArrayField = (field: string | string[]) => {
      if (Array.isArray(field)) return field; // If already an array, return it as is
      if (typeof field === "string") {
        try {
          return JSON.parse(field); // Try parsing JSON (for frontend requests)
        } catch {
          return field.split(",").map((item) => item.trim()); // Fallback: split comma-separated values (for Swagger)
        }
      }
      return [];
    };

    const brandExists = await BrandModel.findOne({
      _id: brand,
      isDeleted: false,
    });
    if (!brandExists) {
      return res.status(400).json({ message: "Invalid or deleted brand" });
    }

    const newProduct = new ProductModel({
      name,
      description,
      brand,
      category,
      price,
      stock,
      skinType: parseArrayField(skinType),
      ingredients: parseArrayField(ingredients),
      images: [imageUrl],
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({
      message: "Error creating product",
      error: (err as Error).message,
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    let {
      page = "1",
      limit = "10",
      keyword,
      category,
      skinType,
      minPrice,
      maxPrice,
      brandName,
    } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let filter: any = { isDeleted: false };

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (skinType) {
      filter.skinType = { $in: skinType };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
    }

    if (brandName) {
      const brands = await BrandModel.find({
        brandName: { $regex: brandName, $options: "i" },
        isDeleted: false,
      }).select("_id");

      filter.brand = { $in: brands.map((brand) => brand._id) };
    }

    const products = await ProductModel.find(filter)
      .populate("brand")
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await ProductModel.countDocuments(filter);
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
    }).populate("brand");

    if (!product || product.isDeleted)
      return res.status(404).json({ message: "Product not found" });

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
