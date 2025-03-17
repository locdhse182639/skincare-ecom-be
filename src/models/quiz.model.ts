import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  points: { type: Number, required: true },
});

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answers: [AnswerSchema],
});

const QuizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [QuestionSchema],
  },
  {
    timestamps: true,
  }
);

export const QuizModel = mongoose.model("Quiz", QuizSchema);
