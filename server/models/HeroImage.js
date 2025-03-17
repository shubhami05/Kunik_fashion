import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema({
  url: String,
  title: String,
  subtitle: String,
});

export default mongoose.model("HeroImage", heroImageSchema);