// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URI,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("MongoDB connected successfully"));


app.get('/', (req, res) => {
  res.json({ message: 'Backend is workingghgh!' });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/hero", heroRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});