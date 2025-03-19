import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
 {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    answers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer",
        },
    ],
    isDeleted: {
        type: Boolean,
        default: false,
    }, 
 },

  {timestamps: true}

);

export const QuestionModel = mongoose.model("Question", QuestionSchema);
