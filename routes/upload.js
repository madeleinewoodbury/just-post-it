const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");
const Categories = require("../models/Category");
const cloudinary = require("cloudinary");
// const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

const imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Load Post Model
require("../models/Post");
const Post = mongoose.model("posts");
require("../models/User");
const User = mongoose.model("users");
require("../models/Image");
const Image = mongoose.model("images");

// Process Add Post Form
router.post(
  "/post",
  ensureAuthenticated,
  upload.single("image"),
  (req, res) => {
    const newPost = new Post({
      title: req.body.title,
      category: req.body.category,
      body: req.body.body,
      user: req.user.id
    });
    if (req.file) {
      cloudinary.uploader.upload(req.file.path, result => {
        req.body.image = result.secure_url;
        newPost.image = req.body.image;

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
    } else {
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
    }
  }
);

router.post(
  "/image",
  ensureAuthenticated,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.redirect("/");
    }
    cloudinary.uploader.upload(req.file.path, result => {
      req.body.image = result.secure_url;

      const newImage = new Image({ path: req.body.image });

      newImage
        .save()
        .then(image => {
          res.render("user/profile", { image: image });
        })
        .catch(err => {
          req.flash("error_msg", "Something went wrong");
          return res.redirect("/");
        });
    });
  }
);

// Edit Post Image Process Route
router.put(
  "/edit/post/image/:id",
  ensureAuthenticated,
  upload.single("image"),
  (req, res) => {
    Post.findOne({ _id: req.params.id }).then(post => {
      if (!req.file) {
        return res.render("posts/edit", { post: post, Categories: Categories });
      } else {
        cloudinary.uploader.upload(req.file.path, result => {
          req.body.image = result.secure_url;
          // New Image Value
          post.image = req.body.image;

          post
            .save()
            .then(post => {
              res.render("posts/edit", { post: post, Categories: Categories });
            })
            .catch(err => {
              req.flash("error_msg", "Something went wrong");
              return res.redirect("/");
            });
        });
      }
    });
  }
);

module.exports = router;
