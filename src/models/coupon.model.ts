import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true, min:1, max:100 },
  expiresAt: { type: Date, required: true },
  isUsed: { type: Boolean, default: false },
});

export const CouponModel = mongoose.model("Coupon", CouponSchema);