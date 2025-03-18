import {Request, response, Response} from "express";
import { FeedbackModel } from "../models/feedback.model";
import { ProductModel } from "../models/product.model";
//get
export const getAllFeedbacks = async (req: Request, res: Response) => {
    try{
       const feedbacks = await FeedbackModel.find({isDeleted: false})
       .populate("userId", "name email")
       .populate("productId","name")
       .sort({createdAt: -1});
       
       res.status(200).json({success: true, data: feedbacks});
    }catch (error: any){
        res.status(500).json({success: false, message: "Lỗi", error: error.message});

    }
    };
//delete
export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Kiểm tra phản hồi có tồn tại không
    const feedback = await FeedbackModel.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: "Phản hồi không tồn tại." });
    }

    feedback.isDeleted = true;
    await feedback.save();

    res.status(200).json({ success: true, message: "Phản hồi đã bị xóa." });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa phản hồi.", error: error.message });
  }
};

  
//restore
export const restoreFeedback = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const feedback = await FeedbackModel.findOne({ _id: id, isDeleted: true });
  
      if (!feedback) {
        return res.status(404).json({ message: "Không tìm thấy phản hồi để khôi phục." });
      }
  
      feedback.isDeleted = false;
      await feedback.save();
  
      res.status(200).json({ success: true, message: "Phản hồi đã được khôi phục." });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Lỗi khi khôi phục phản hồi.", error: error.message });
    }
  };
  
//filter 
export const filterFeedbacks = async (req: Request, res: Response) => {
  try{
    const { productId, userId } = req.query;
    let filter : any = {};

    if (productId){
     filter.productId = productId;
    }
    if (userId){
        filter.userId =  userId;
    }
    const feedbacks = await FeedbackModel.find(filter)
    .populate("userId", "name email")
    .populate("productId","name")
    .sort({createdAt: -1});
    res.status(200).json({success: true, data: feedbacks});

  }catch(error: any){
    res.status(404).json({success: false, message: "Lỗi", error: error.message});
  }
};


