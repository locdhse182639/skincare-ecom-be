import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { setupSwagger } from "./config/swagger";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";

const app = express();

const allowedOrigins: Set<string> = new Set([
  "http://localhost:3000",
  "app-ecommerce-nine-sooty.vercel.app",
]);

app.use(express.json());
app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: string | boolean) => void
    ) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, origin); // Allow the request from this origin
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow sending cookies
  })
);
app.use(helmet());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Skincare E-Commerce Backend is Running!");
});

setupSwagger(app);

export default app;
