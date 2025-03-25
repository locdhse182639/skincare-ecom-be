import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import brandRoutes from "./routes/brand.routes";
import feedbackRoutes from "./routes/feedback.routes";
import quizRoutes from "./routes/quiz.routes";
import feedbackManagementRoutes from "./routes/feedback.management.routes";
import blogRoutes from "./routes/blog.routes";
import questionRoutes from "./routes/question.routes";
import answerRoutes from "./routes/answer.routes";
import deliveryRoutes from "./routes/delivery.routes";
import couponRoutes from "./routes/coupon.routes";
import faqRoutes from "./routes/FAQ.routes";


const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/admin/feedbacks", feedbackManagementRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/coupons", couponRoutes); 
app.use("/api/faqs", faqRoutes);
app.get("/", (req, res) => {
  res.send("Skincare E-Commerce Backend is Running!");
});

setupSwagger(app);

export default app;
