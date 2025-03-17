import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
    {
        brandName: { type: String, required: true, unique: true },
        isDeleted: { type: Boolean, default: false },
    },
    {timestamps: true}
);

export const BrandModel = mongoose.model("Brand", BrandSchema);