import { Request, Response } from "express";
import { AnswerModel } from "../models/answer.model";
import { QuestionModel } from "../models/question.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";



export const createAnswer = async (req: AuthenticatedRequest, res: Response) => {
    try {

      if (!req.user || (req.user.role !=="admin" && req.user.role !=="staff")){
        return res.status(403).json({ message: "Chỉ Admin hoặc Staff mới có quyền thêm câu trả lời." });
      }

      const { questionId, content } = req.body;
      const question = await QuestionModel.findById(questionId);
      
      if (!question) {
        return res.status(404).json({ message: "Không tìm thấy câu hỏi." });
      }

      const newAnswer = new AnswerModel({
        questionId,
        content,
        userId: req.user.id,
      });
      await newAnswer.save();
      res.status(201).json({ success: true, data: newAnswer });


    }catch(error:any){
        res.status(500).json({ success: false, message: "Lỗi khi tạo câu trả lời.", error: error.message });
    }
};

export const updateAnswer = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user || (req.user.role !== "admin" && req.user.role !== "staff")) {
        return res.status(403).json({ message: "Chỉ Admin hoặc Staff mới có quyền cập nhật câu trả lời." });
      }
  
      const { id } = req.params;
      const { content } = req.body;
  
      // Kiểm tra xem câu trả lời có tồn tại không
      const answer = await AnswerModel.findById(id);
      if (!answer) {
        return res.status(404).json({ message: "Không tìm thấy câu trả lời." });
      }
  
      // Kiểm tra quyền chỉnh sửa (Staff chỉ sửa câu trả lời của chính họ)
      if (req.user.role !== "admin" && answer.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa câu trả lời này." });
      }
  
      answer.content = content;
      await answer.save();
  
      res.status(200).json({ success: true, data: answer });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Lỗi khi cập nhật câu trả lời.", error: error.message });
    }
  };

  export const deleteAnswer = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Chỉ Admin mới có quyền xóa câu trả lời." });
      }
  
      const { id } = req.params;
  

      const answer = await AnswerModel.findById(id);
      if (!answer) {
        return res.status(404).json({ message: "Không tìm thấy câu trả lời." });
      }
  
      answer.isDeleted = true;
      await answer.save();
  
      res.status(200).json({ success: true, message: "Câu trả lời đã bị xóa." });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Lỗi khi xóa câu trả lời.", error: error.message });
    }
  };


  export const restoreAnswer = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Chỉ Admin mới có quyền khôi phục câu trả lời." });
      }
  
      const { id } = req.params;
  
      // Kiểm tra xem câu trả lời có tồn tại không
      const answer = await AnswerModel.findOne({ _id: id, isDeleted: true });
      if (!answer) {
        return res.status(404).json({ message: "Không tìm thấy câu trả lời để khôi phục." });
      }
  
      answer.isDeleted = false;
      await answer.save();
  
      res.status(200).json({ success: true, message: "Câu trả lời đã được khôi phục." });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Lỗi khi khôi phục câu trả lời.", error: error.message });
    }
  };


