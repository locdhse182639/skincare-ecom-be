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

app.get("/", (req, res) => {
  res.send("Skincare E-Commerce Backend is Running!");
});

setupSwagger(app);

export default app;
