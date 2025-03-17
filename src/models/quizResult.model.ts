import mongoose from "mongoose";

const QuizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
        required: true,
      },
      points: { type: Number, required: true },
    },
  ],
  totalPoints: { type: Number, required: true },
  skinType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const QuizResultModel = mongoose.model("QuizResult", QuizResultSchema);
