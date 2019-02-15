const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");

// Load Post  Modle
require("../models/Post");
const Post = mongoose.model("posts");

// Process Add Post Form
router.post("/add", (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    category: req.body.category,
    image: req.body.image,
    body: req.body.body,
    user: req.user.id
  });

  console.log(newPost);
  newPost
    .save()
    .then(post => {
      req.flash("success_msg", "Post submitted");
      res.redirect("/user/login");
    })
    .catch(err => {
      console.log(err);
      return;
    });
});

module.exports = router;
