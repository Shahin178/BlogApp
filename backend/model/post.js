const mongoose = require("mongoose");

// Define the Subheading schema
const SubheadingSchema = new mongoose.Schema({
  subheading: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// Define the Post schema
const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL to the image
    required: true, // Image is now required at the post level
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  readTime: {
    type: Number,
    required: true,
  },
  subheadings: [SubheadingSchema], // Embedding the Subheading schema
});

module.exports = mongoose.model("Post", PostSchema);
