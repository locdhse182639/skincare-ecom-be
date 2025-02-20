import mongoose from "mongoose";
import dotenv from "dotenv";
import { ProductModel } from "./models/product.model";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB Connected for Seeding!"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

const seedProducts = async () => {
  try {
    await ProductModel.deleteMany();

    const products = [
      {
        name: "Hydrating Face Cream",
        description: "A deeply hydrating cream for dry and sensitive skin.",
        brand: "GlowSkin",
        price: 29.99,
        category: "Moisturizer",
        stock: 50,
        rating: 4.5,
        reviews: 10,
        images: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg",
        ],
        skinType: ["dry", "sensitive"],
        ingredients: ["Hyaluronic Acid", "Ceramides"],
      },
      {
        name: "Oil-Free Acne Cleanser",
        description: "A powerful cleanser for acne-prone skin.",
        brand: "ClearSkin",
        price: 19.99,
        category: "Cleanser",
        stock: 30,
        rating: 4.7,
        reviews: 25,
        images: [
          "https://example.com/image3.jpg",
          "https://example.com/image4.jpg",
        ],
        skinType: ["oily", "combination"],
        ingredients: ["Salicylic Acid", "Tea Tree Oil"],
      },
      {
        name: "Vitamin C Serum",
        description: "A brightening serum for all skin types.",
        brand: "DermaGlow",
        price: 34.99,
        category: "Serum",
        stock: 40,
        rating: 4.8,
        reviews: 18,
        images: [
          "https://example.com/image5.jpg",
          "https://example.com/image6.jpg",
        ],
        skinType: ["all"],
        ingredients: ["Vitamin C", "Ferulic Acid"],
      },
    ];

    await ProductModel.insertMany(products);
    console.log("Product Seeded Successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error Seeding Products:", err);
    mongoose.connection.close();
  }
};

seedProducts();
