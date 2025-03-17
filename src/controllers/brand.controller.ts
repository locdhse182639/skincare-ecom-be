import { BrandModel } from "../models/brand.model";
import { ProductModel } from "../models/product.model";
import { Request, Response } from "express";

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { brandName } = req.body;
    const newBrand = new BrandModel({ brandName });
    await newBrand.save();
    res
      .status(201)
      .json({ message: "Brand created successfully", brand: newBrand });
  } catch (error) {
    res.status(500).json({ message: "Error creating brand", error: error });
  }
};

export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const brands = await BrandModel.find({ isDeleted: false });
    res.json({ brands });
  } catch (err) {
    res.status(500).json({ message: "Error fetching brands", error: err });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const { brandName } = req.body;
    const brand = await BrandModel.findById(req.params.id);

    if (!brand) return res.status(404).json({ message: "Brand not found" });
    brand.brandName = brandName;

    await brand.save();

    res.json({ message: "Brand updated successfully", brand });
  } catch (error) {
    res.status(500).json({ message: "Error updating brand", error: error });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const brand = await BrandModel.findById(req.params.id);

    if (!brand) return res.status(404).json({ message: "Brand not found" });

    const products = await ProductModel.find({ brand: brand._id });
    if (products.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete brand with products" });
    }

    brand.isDeleted = true;
    await brand.save();

    res.json({ message: "Brand deleted successfully (soft delete)", brand });
  } catch (err) {
    res.status(500).json({ message: "Error deleting brand", error: err });
  }
};

export const reactivateBrand = async (req: Request, res: Response) => {
  try {
    const brand = await BrandModel.findById(req.params.id);

    if (!brand) return res.status(404).json({ message: "Brand not found" });

    brand.isDeleted = false;
    await brand.save();

    res.json({ message: "Brand reactivated successfully", brand });
  } catch (err) {
    res.status(500).json({ message: "Error reactivating brand", error: err });
  }
};

export const adminGetBrands = async (req: Request, res: Response) => {
  try {
    let {
      page = "1",
      limit = "10",
      keyword,
      includeDeleted = "false",
    } = req.query;

    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    let filter: any = {};

    if (keyword) {
      filter.brandName = { $regex: keyword, $options: "i" };
    }

    if (includeDeleted === "false") {
      filter.isDeleted = false;
    }

    const brands = await BrandModel.find(filter)
      .skip(skip)
      .limit(limitNumber);

    const totalBrands = await BrandModel.countDocuments(filter);
    const totalPages = Math.ceil(totalBrands / limitNumber);

    res.json({
      brands,
      totalBrands,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching brands", error: err });
  }
};

