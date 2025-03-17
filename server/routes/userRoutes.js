// import express from "express";
// import User from "../models/User.js";

// const router = express.Router();

// router.post("/register", async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.post("/login", async (req, res) => {
//   const { mobile, password } = req.body;
//   const user = await User.findOne({ mobile, password });
//   if (user) {
//     res.json(user);
//   } else {
//     res.status(401).json({ message: "Invalid credentials" });
//   }
// });

// export default router;



import express from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, mobile, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      id: uuidv4(),
      name,
      mobile,
      password: hashedPassword,
      isAdmin:false,
      isPendingApproval: false, // Admins need approval
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log('eror', error.message)
    res.status(500).json({ error: error.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Find user in database
    const user = await User.findOne({ mobile });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
