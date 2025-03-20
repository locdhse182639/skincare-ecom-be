import { Request, Response } from "express";
import { CouponModel } from "../models/coupon.model";
import { UserModel } from "../models/user.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { generateCouponCode } from "../utils/coupon";

export const redeemCoupon = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { points, discount } = req.body;

  if (!points || !discount) {
    return res.status(400).json({ message: "Points and discount are required" });
  }
  if (points <= 0 || discount <= 0) {
    return res.status(400).json({ message: "Points and discount must be positive numbers" });
  }

  const user = await UserModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.points < points) {
    return res
      .status(400)
      .json({ message: "Not enough points to redeem this coupon" });
  }

  user.points -= points;

  const coupon = new CouponModel({
    user: userId,
    code: generateCouponCode(),
    discount,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  });

  await coupon.save();
  user.coupons.push(coupon._id);
  await user.save();

  res.status(201).json({ message: "Coupon redeemed successfully", coupon });
};

export const getUserCoupons = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  const coupons = await CouponModel.find({ user: userId });
  if (!coupons.length)
    return res.status(404).json({ message: "No coupons found" });

  res.status(200).json({ coupons });
};

export const getAllUserCoupons = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const coupons = await CouponModel.find({ user: userId });
  if (!coupons.length)
    return res.status(404).json({ message: "No coupons found for this user" });

  res.status(200).json({ coupons });
};


