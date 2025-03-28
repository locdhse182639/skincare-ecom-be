import { Request, Response } from "express";
import { FAQModel } from "../models/FAQ.models";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

// Create FAQ
export const createFAQ = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin" && req.user?.role !== "staff") {
      return res.status(403).json({ message: "Chỉ admin hoặc staff mới được tạo FAQ." });
    }

    const { question, content } = req.body;
    const faq = await FAQModel.create({ question, content });

    res.status(201).json({ success: true, data: faq });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Lỗi tạo FAQ", error: error.message });
  }
};

// Get all FAQs
export const getAllFAQs = async (_req: Request, res: Response) => {
  try {
    const faqs = await FAQModel.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Lỗi lấy danh sách FAQ", error: error.message });
  }
};

// Update FAQ
export const updateFAQ = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin" && req.user?.role !== "staff") {
      return res.status(403).json({ message: "Không có quyền cập nhật FAQ" });
    }

    const { id } = req.params;
    const { question, content } = req.body;

    const updatedFAQ = await FAQModel.findByIdAndUpdate(
      id,
      { question, content },
      { new: true }
    );

    if (!updatedFAQ) {
      return res.status(404).json({ message: "FAQ không tồn tại" });
    }

    res.status(200).json({ success: true, data: updatedFAQ });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật FAQ", error: error.message });
  }
};

// Delete (soft delete)
export const deleteFAQ = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin" && req.user?.role !== "staff") {
      return res.status(403).json({ message: "Không có quyền xóa FAQ" });
    }

    const { id } = req.params;
    const faq = await FAQModel.findById(id);
    if (!faq) return res.status(404).json({ message: "FAQ không tồn tại" });

    faq.isDeleted = true;
    await faq.save();

    res.status(200).json({ success: true, message: "Đã xóa FAQ" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Lỗi xóa FAQ", error: error.message });
  }
};

// Restore FAQ
export const restoreFAQ = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin" && req.user?.role !== "staff") {
      return res.status(403).json({ message: "Không có quyền khôi phục FAQ" });
    }

    const { id } = req.params;
    const faq = await FAQModel.findOne({ _id: id, isDeleted: true });
    if (!faq) return res.status(404).json({ message: "Không tìm thấy FAQ cần khôi phục" });

    faq.isDeleted = false;
    await faq.save();

    res.status(200).json({ success: true, message: "Khôi phục FAQ thành công" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Lỗi khôi phục FAQ", error: error.message });
  }
};
