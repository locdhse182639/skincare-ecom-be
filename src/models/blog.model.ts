import mongoose from "mongoose";
import { title } from "process";
const BlogSchema = new mongoose.Schema(
    {
    title: {type: String, required: true},
    excerpt: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    link: {type: String, required: true},
    isDeleted: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now}
    },
    {timestamps: true}
);
export const BlogModel = mongoose.model("Blog", BlogSchema);