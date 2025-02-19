import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { sendVerificationEmail } from "../utils/email";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const emailVerificationToken = jwt.sign(
      { email },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "1d" }
    );

    const newUser = new UserModel({
      name,
      email,
      password,
      emailVerificationToken,
    });
    await newUser.save();

    await sendVerificationEmail(email, emailVerificationToken);

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isVerified: newUser.isVerified,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) return res.status(400).json({ message: "Invalid token" });

  try {
    const decoded = jwt.verify(
      token as string,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { email: string };
    const user = await UserModel.findOne({ email: decoded.email });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    user.emailVerificationToken = "";
    await user.save();

    res.json({
      message: "Email verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.isVerified)
    return res
      .status(403)
      .json({ message: "Please verify your email before logging in." });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const userPayload = { id: user._id.toString(), role: user.role };
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.json({
    message: "Login successful",
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skinType: user.skinType,
      address: user.address,
    },
  });
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
