const express = require("express");
const router = express.Router();
const Post = require("../model/post");

// SEARCH posts by title
router.get("/search", async (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const posts = await Post.find({
      title: new RegExp(searchTerm, "i"),
    });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    res.json(posts);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({
      message: "Internal server error. Please check the server logs.",
    });
  }
});

// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET specific post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new post
router.post("/", async (req, res) => {
  
  const post = new Post({
    title: req.body.title,
    image: req.body.image,
    publishedDate: req.body.publishedDate, 
    readTime: req.body.readTime,
    subheadings: req.body.subheadings,
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a post
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SEARCH posts by title






module.exports = router;
