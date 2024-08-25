const express = require("express");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = new User({ username, email, password });
    await user.save();

    // Respond with success message and user details
    res.status(201).json({
      message: "Signup successful!",
      user: {
        username,
        email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Login
router.post("/login", async (req, res) => {
 try {
   const { email, password } = req.body;

   // Find the user by email
   const user = await User.findOne({ email });
   if (!user) {
     return res.status(401).json({
       message: "User does not exist. Please sign up first.",
     });
   }

   // Compare the password
   const isPasswordMatch = await user.comparePassword(password);
   if (!isPasswordMatch) {
     return res.status(401).json({
       message: "Incorrect password",
     });
   }

   // Generate a token
   const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
     expiresIn: "1h",
   });

   // Set the token as a cookie
   res.cookie("Token", token);

   // Respond with success message, user details, and token
   res.status(200).json({
     message: "Login successful!",
     user: {
       username: user.username,
       email: user.email,
     },
     token,
   });
 } catch (error) {
   console.log(error);
   res.status(500).json({
     message: "An error occurred during login",
   });
 }
});

module.exports = router;
