import express from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
