import { Request, Response } from "express";
import { QuizModel } from "../models/quiz.model";
import { UserModel } from "../models/user.model";
import { ProductModel } from "../models/product.model";
import { QuizResultModel } from "../models/quizResult.model";

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { title, description, questions } = req.body;
    const newQuiz = new QuizModel({ title, description, questions });
    await newQuiz.save();
    res
      .status(201)
      .json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (err) {
    res.status(500).json({ message: "Error creating quiz", error: err });
  }
};

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await QuizModel.find();
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ message: "Error fetching quizzes", error: err });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const quiz = await QuizModel.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ quiz });
  } catch (err) {
    res.status(500).json({ message: "Error fetching quiz", error: err });
  }
};

export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const { title, description, questions } = req.body;
    const quiz = await QuizModel.findByIdAndUpdate(
      req.params.id,
      { title, description, questions },
      { new: true }
    );
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ message: "Quiz updated successfully", quiz });
  } catch (err) {
    res.status(500).json({ message: "Error updating quiz", error: err });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await QuizModel.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json({ message: "Quiz deleted successfully", quiz });
  } catch (err) {
    res.status(500).json({ message: "Error deleting quiz", error: err });
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const { userId, answers } = req.body;

    let totalPoints = 0;
    for (const answer of answers) {
      totalPoints += answer.points;
    }

    let skinType = "normal";
    if (totalPoints <= 5) {
      skinType = "dry";
    } else if (totalPoints <= 10) {
      skinType = "oily";
    } else if (totalPoints <= 15) {
      skinType = "combination";
    } else if (totalPoints <= 20) {
      skinType = "sensitive";
    }

    const quizResult = new QuizResultModel({
      userId,
      quizId: req.params.id,
      answers,
      totalPoints,
      skinType,
    });
    await quizResult.save();

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { skinType, $push: { quizResults: quizResult._id } },
      { new: true }
    );

    const recommendedProducts = await ProductModel.find({ skinType });

    res.json({
      message: "Quiz submitted successfully",
      user,
      recommendedProducts,
      quizResult,
    });
  } catch (err) {
    res.status(500).json({ message: "Error submitting quiz", error: err });
  }
};

export const getPastQuizzes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId).populate("quizResults");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ quizResults: user.quizResults });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching past quizzes", error: err });
  }
};


