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

export const getAllUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestingUser = req.user;

    if (!requestingUser) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    let filter: any = {};

    if (requestingUser.role === "user") {
      filter.role = "user";
    } else if (requestingUser.role === "admin") {
      filter.role = { $in: ["user", "staff"] };
    } else if (requestingUser.role === "staff") {
      filter.role = "user";
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Search by name
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" }; // case-insensitive search
    }

    // Filter by email
    if (req.query.email) {
      filter.email = { $regex: req.query.email, $options: "i" }; // case-insensitive search
    }

    // Filter by role
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Filter by verification status
    if (req.query.isVerified) {
      filter.isVerified = req.query.isVerified === "true";
    }

    // Filter by ban status
    if (req.query.isBanned) {
      filter.isBanned = req.query.isBanned === "true";
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await UserModel.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit);

    const totalUsers = await UserModel.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, skinType, address } = req.body;
    const user = await UserModel.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (skinType) user.skinType = skinType;

    if (address) {
      user.address = {
        ...user.address, 
        ...address, 
      };
    }

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err });
  }
};

export const banUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBanned) {
      return res.status(400).json({ message: "User is already banned" });
    }

    user.isBanned = true;
    await user.save();

    res.json({ message: "User has been banned successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error banning user", error: err });
  }
};

export const unbanUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isBanned) {
      return res.status(400).json({ message: "User is not banned" });
    }

    user.isBanned = false;
    await user.save();

    res.json({ message: "User has been unbanned successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error unbanning user", error: err });
  }
};

export const addPoints = async (req: Request, res: Response) => {
  try {
    const { userId, points } = req.body;

    // Validate input
    if (!userId || !points) {
      return res.status(400).json({ message: "User ID and points are required" });
    }
    if (points <= 0) {
      return res.status(400).json({ message: "Points must be a positive number" });
    }

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.points += points;
    await user.save();

    res.status(200).json({ message: "Points added successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error adding points", error: err });
  }
};

