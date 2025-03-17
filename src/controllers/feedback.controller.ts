import { Request, Response } from "express";
import { FeedbackModel } from "../models/feedback.model";
import { ProductModel } from "../models/product.model";

interface AuthenticatedRequest extends Request {
    user?: { id: string; role: string };
  }

// Create new feedback
export const createFeedback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;
    
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;

    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create new feedback
    const feedback = await FeedbackModel.create({
      userId,
      productId,
      rating,
      comment
    });

    // Update product rating and reviews count
    const allFeedbacks = await FeedbackModel.find({ 
      productId, 
      isDeleted: false 
    });
    
    const totalRating = allFeedbacks.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / allFeedbacks.length;

    await ProductModel.findByIdAndUpdate(productId, {
      rating: averageRating,
      reviews: allFeedbacks.length
    });

    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating feedback",
      error: error?.message || "Unknown error occurred"
    });
  }
};

// Update feedback
export const updateFeedback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;

    const feedback = await FeedbackModel.findById(id);
    
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Check if the user owns this feedback
    if (feedback.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this feedback" });
    }

    const updatedFeedback = await FeedbackModel.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true }
    );

    // Update product rating
    const productId = feedback.productId;
    const allFeedbacks = await FeedbackModel.find({ 
      productId, 
      isDeleted: false 
    });
    
    const totalRating = allFeedbacks.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / allFeedbacks.length;

    await ProductModel.findByIdAndUpdate(productId, {
      rating: averageRating
    });

    res.status(200).json({
      success: true,
      data: updatedFeedback
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating feedback",
      error: error?.message || "Unknown error occurred"
    });
  }
};

// Delete feedback (soft delete)
export const deleteFeedback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.user?.id) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userId = req.user.id;

    const feedback = await FeedbackModel.findById(id);
    
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Check if the user owns this feedback
    if (feedback.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this feedback" });
    }

    // Soft delete
    await FeedbackModel.findByIdAndUpdate(id, { isDeleted: true });

    // Update product rating and reviews count
    const productId = feedback.productId;
    const allFeedbacks = await FeedbackModel.find({ 
      productId, 
      isDeleted: false 
    });
    
    const totalRating = allFeedbacks.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = allFeedbacks.length > 0 ? totalRating / allFeedbacks.length : 0;

    await ProductModel.findByIdAndUpdate(productId, {
      rating: averageRating,
      reviews: allFeedbacks.length
    });

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error deleting feedback",
      error: error?.message || "Unknown error occurred"
    });
  }
};

// Get feedback by product ID
export const getFeedbacksByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    
    const feedbacks = await FeedbackModel.find({ 
      productId, 
      isDeleted: false 
    })
    .populate("userId", "name email") // Only get name and email from user
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: feedbacks
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching feedbacks",
      error: error?.message || "Unknown error occurred"
    });
  }
}; 