const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 

require("./db");

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
const postsRoute = require("./routes/post");
app.use("/posts", postsRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
