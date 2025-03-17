import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  password: String,
  isAdmin: Boolean,
  isApproved: { type: Boolean, default: false },
});

export default mongoose.model("User", userSchema);