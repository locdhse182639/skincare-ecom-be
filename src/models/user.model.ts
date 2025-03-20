import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AddressSchema = new mongoose.Schema({
  fullName: { type: String, required: false },
  street: { type: String, required: false },
  city: { type: String, required: false },
  district: { type: String, required: false },
  phone: { type: String, required: false },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "staff"], default: "user" },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    skinType: {
      type: String,
      enum: ["oily", "dry", "combination", "sensitive", "normal"],
      default: "normal",
    },
    quizResults: [{ type: mongoose.Schema.Types.ObjectId, ref: "QuizResult" }],
    address: { type: AddressSchema, default: null },
    points: { type: Number, default: 0 }, // Track user points
    coupons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon", // Reference to the Coupon model
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const UserModel = mongoose.model("User", UserSchema);
