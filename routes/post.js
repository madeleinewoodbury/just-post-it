const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");
const Categories = require("../models/Category");

// Load Models
require("../models/Post");
const Post = mongoose.model("posts");
require("../models/User");
const User = mongoose.model("users");

// Show Single Post Route
router.get("/show/:id", ensureAuthenticated, (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate("user")
    .populate("comments.commentUser")
    .then(post => {
      res.render("posts/show", { post: post });
    })
    .catch(err => console.log(err));
});

// Edit Post Route
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate("user")
    .then(post => {
      if (post.user.id === req.user.id) {
        res.render("posts/edit", {
          post: post,
          Categories: Categories
        });
      } else {
        req.flash("error_msg", "You are not authorized");
        res.redirect("/");
      }
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

// Show Public Posts Route
router.get("/public", ensureAuthenticated, (req, res) => {
  Post.find()
    .populate("user")
    .sort({ date: "desc" })
    .then(posts => {
      res.render("index/posts", { posts: posts });
    });
});

// Search for post route
router.post("/search", ensureAuthenticated, (req, res) => {
  let searchValue = req.body.search;
  searchValue = searchValue.charAt(0).toUpperCase() + searchValue.slice(1);
  let posts = [];

  Post.find()
    .populate("user")
    .sort({ date: "desc" })
    .then(result => {
      for (post of result) {
        if (post.title.includes(searchValue)) {
          posts.push(post);
        }
      }
      res.render("index/posts", { posts: posts });
    });
});

// Post comment Route
router.post("/comment/:id", ensureAuthenticated, (req, res) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };

    // Add to comments array
    post.comments.unshift(newComment);
    post.save().then(post => {
      res.redirect(`/post/show/${post.id}`);
    });
  });
});

// Search for categories route
router.post("/search/categories", ensureAuthenticated, (req, res) => {
  let searchValue = req.body.search;
  searchValue = searchValue.charAt(0).toUpperCase() + searchValue.slice(1);
  let posts = [];

  Post.find()
    .populate("user")
    .sort({ date: "desc" })
    .then(result => {
      for (post of result) {
        if (post.category.includes(searchValue)) {
          posts.push(post);
        }
      }
      res.render("index/categories", { posts: posts });
    });
});

module.exports = router;
