import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";

interface AuthenticatedRequest extends Request {
    user?: { id: string; role: string };
  }

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user?.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, skinType, address } = req.body;
    const user = await UserModel.findById(req.user?.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (skinType) user.skinType = skinType;
    if (address) user.address = address;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const changeUserPassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user?.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    user.password = newPassword
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error changing password" });
  }
};
