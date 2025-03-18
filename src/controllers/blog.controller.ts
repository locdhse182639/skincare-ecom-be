import { Request, Response } from "express";
import { BlogModel } from "../models/blog.model";


export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, excerpt, description, image, link } = req.body;

    if (!title || !excerpt || !description || !image || !link) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin blog!" });
    }

    const newBlog = new BlogModel({ title, excerpt, description, image, link, isDeleted: false });
    await newBlog.save();

    return res.status(201).json({ success: true, data: newBlog });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Lỗi khi tạo blog", error: error.message });
  }
};


export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await BlogModel.find({ isDeleted: false }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: blogs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách blog", error: error.message });
  }
};


export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await BlogModel.findOne({ _id: id, isDeleted: false });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Không tìm thấy blog" });
    }

    return res.status(200).json({ success: true, data: blog });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Lỗi khi lấy blog", error: error.message });
  }
};


export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBlog = await BlogModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: "Không tìm thấy blog" });
    }

    return res.status(200).json({ success: true, data: updatedBlog });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Lỗi khi cập nhật blog", error: error.message });
  }
};


export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await BlogModel.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Không tìm thấy blog" });
    }

    blog.isDeleted = true;
    await blog.save();

    return res.status(200).json({ success: true, message: "Blog đã bị xoá" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Lỗi khi xóa blog", error: error.message });
  }
};


export const restoreBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await BlogModel.findOne({ _id: id, isDeleted: true });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Không tìm thấy blog để khôi phục" });
    }

    blog.isDeleted = false;
    await blog.save();

    return res.status(200).json({ success: true, message: "Blog đã được khôi phục", data: blog });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Lỗi khi khôi phục blog", error: error.message });
  }
};
