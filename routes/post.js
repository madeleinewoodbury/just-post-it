const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");

// Load Models
require("../models/Post");
const Post = mongoose.model("posts");
require("../models/User");
const User = mongoose.model("users");

// Show Single Post Route
router.get("/show/:id", ensureAuthenticated, (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate("user")
    .then(post => {
      res.render("posts/show", { post: post });
    })
    .catch(err => console.log(err));
});

// Process Add Post Form
router.post("/add", ensureAuthenticated, (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    category: req.body.category,
    body: req.body.body,
    user: req.user.id
  });

  if (req.body.image) {
    newPost.image = req.body.image;
  }

  newPost
    .save()
    .then(post => {
      req.flash("success_msg", "Post submitted");
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      return;
    });
});

// Edit Post Route
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      res.render("posts/edit", {
        post: post
      });
    })
    .catch(err => {
      console.log(err);
    });
});

// Process Edit Route
router.put("/edit/:id", ensureAuthenticated, (req, res) => {
  Post.findOne({
    _id: req.params.id
  }).then(post => {
    // New values
    (post.title = req.body.title),
      (post.category = req.body.category),
      (post.body = req.body.body);

    post.save().then(post => {
      res.redirect("/");
    });
  });
});

// Delete Post
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect("/");
  });
});

router.get("/public", ensureAuthenticated, (req, res) => {
  Post.find()
    .populate("user")
    .sort({ date: "desc" })
    .then(posts => {
      res.render("index/posts", { posts: posts });
    });
});

module.exports = router;
