const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");
const Categories = require("../models/Category");

// Load Post Model
require("../models/Post");
const Post = mongoose.model("posts");
require("../models/User");
const User = mongoose.model("users");

// Landing Page/Dashboard Route
router.get("/", (req, res) => {
  if (req.user) {
    // Only find posts that match the current user
    Post.find({ user: req.user.id })
      // sort posts by descending order
      .sort({ date: "desc" })
      .then(posts => {
        res.render("index/dashboard", {
          posts: posts,
          Categories: Categories
        });
      });
  } else {
    Post.find().then(posts => {
      const numOfPosts = posts.length;
      User.find().then(users => {
        const numOfUsers = users.length;
        res.render("home", {
          numOfPosts: numOfPosts,
          numOfUsers: numOfUsers,
          Categories: Categories
        });
      });
    });
  }
});

// Users Route
router.get("/users", ensureAuthenticated, (req, res) => {
  res.render("index/users");
});

// Posts Route
router.get("/posts", ensureAuthenticated, (req, res) => {
  res.render("index/posts");
});

// Categories Route
router.get("/categories", ensureAuthenticated, (req, res) => {
  res.render("index/categories");
});

module.exports = router;
