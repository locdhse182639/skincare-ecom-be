import { Request, Response } from "express";
import { QuestionModel } from "../models/question.model";
import { AnswerModel } from "../models/answer.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
// import { body } from "express-validator";


export const askQuestion = async (req: AuthenticatedRequest, res: Response) => {
    try{

     if (!req.user?.id){
        return res.status(401).json({ message: "Bạn cần đăng nhập để đặt câu hỏi." });
     }
     const {question} = req.body;
     const newQuestion = new QuestionModel({userId: req.user.id, question});
     await newQuestion.save();
     res.status(201).json({ success: true, data: newQuestion });
    }catch (error: any) {
        res.status(500).json({ success: false, message: "Lỗi khi đặt câu hỏi", error: error.message });
      }
};

export const getAllQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await QuestionModel.find({isDeleted: false}).populate("userId", "name email").sort({createdAt: -1});
    res.status(200).json({ success: true, data: questions });
  }catch(error:any){
    res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách câu hỏi", error: error.message });
  }
};

export const updateQuestion = async (req: AuthenticatedRequest, res: Response) => {
  try{

    if (!req.user?.id) {
        return res.status(401).json({ message: "Bạn cần đăng nhập để chỉnh sửa câu hỏi." });
    }

    const { id } = req.params;
    const { question } = req.body;

    const existingQuestion = await QuestionModel.findById(id);

    if(!existingQuestion){
      return res.status(404).json({ message: "Không tìm thấy câu hỏi." });
    }

    if(existingQuestion.userId.toString() !== req.user.id){
        return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa câu hỏi này." }); 
    }

    existingQuestion.question = question;
    await existingQuestion.save();

    res.status(200).json({ success: true, data: existingQuestion });

  }catch (error: any) {
    res.status(500).json({ success: false, message: "Lỗi khi cập nhật câu hỏi", error: error.message });
  }

};

export const deleteQuestion = async (req: AuthenticatedRequest, res: Response) => {
 try{

    if (!req.user?.id) {
        return res.status(401).json({ message: "Bạn cần đăng nhập để xoá câu hỏi." });
    }

    const { id } = req.params;
    const question = await QuestionModel.findById(id);

    if (!question) {
        return res.status(404).json({ message: "Không tìm thấy câu hỏi." });
    }
    if (question.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Bạn không có quyền xóa câu hỏi này." });
    }

    question.isDeleted = true;
    await question.save();

    res.status(200).json({ success: true, message: "Câu hỏi đã bị xóa." });

 }catch(error:any){
    res.status(500).json({ success: false, message: "Lỗi khi xóa câu hỏi", error: error.message });
 }
};

export const restoreQuestion = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Bạn cần đăng nhập để khôi phục câu hỏi." });
      }
  
      const { id } = req.params;
      const question = await QuestionModel.findOne({ _id: id, isDeleted: true });
      if (!question) {
        return res.status(404).json({ message: "Không tìm thấy câu hỏi để khôi phục." });
      }
  

      if (question.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Bạn không có quyền khôi phục câu hỏi này." });
      }
  
      question.isDeleted = false;
      await question.save();
  
      res.status(200).json({ success: true, message: "Câu hỏi đã được khôi phục." });
    } catch (error: any) {
      res.status(500).json({ success: false, message: "Lỗi khi khôi phục câu hỏi", error: error.message });
    }
  };