import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import connectDB from "./config/database";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();
