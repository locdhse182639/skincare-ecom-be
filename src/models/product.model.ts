import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      enum: ["Cleanser", "Moisturizer", "Serum", "Sunscreen", "Toner", "Mask"],
      require: true,
    },
    price: { type: Number, require: true },
    stock: { type: Number, require: true },
    skinType: {
      type: [String],
      enum: ["oily", "dry", "combination", "sensitive", "normal"],
      require: true,
    },
    ingredients: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    images: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("Product", ProductSchema);
