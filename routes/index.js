const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");
const Categories = require("../models/Category");
require("dotenv/config");

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
  User.find().then(users => {
    res.render("index/users", { users: users });
  });
});

// Categories Route
router.get("/categories", ensureAuthenticated, (req, res) => {
  Post.find()
    .populate("users")
    .sort({ category: "asc" })
    .then(posts => {
      res.render("index/categories", {
        posts: posts
      });
    });
});

// Details Route
router.get("/details/:id", ensureAuthenticated, (req, res) => {
  const userId = req.params.id;
  User.findOne({ _id: userId }).then(userDetails => {
    Post.find({ user: userId })
      .sort({ date: "desc" })
      .then(posts => {
        res.render("index/details", { userDetails: userDetails, posts: posts });
      });
  });
});

module.exports = router;
