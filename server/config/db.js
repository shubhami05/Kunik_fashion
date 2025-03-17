import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  // Ensure MONGO_URI is defined
  if (!process.env.MONGO_URI) {
    console.error(" MongoDB connection error: MONGO_URI is not defined in environment variables");
    process.exit(1); // Exit process with failure
  }

  // Check if already connected
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.DB_NAME, // Use database name from environment variables
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
