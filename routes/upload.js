const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");
const Categories = require("../models/Category");
const cloudinary = require("cloudinary");
const multer = require("multer");
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const keys = require("../config/keys");

const imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });

cloudinary.config({
  cloud_name: keys.cloudName,
  api_key: keys.cloudinaryApiKey,
  api_secret: keys.cloudinaryApiSecret
});

// Load Post Model
require("../models/Post");
const Post = mongoose.model("posts");
require("../models/User");
const User = mongoose.model("users");

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

// Edit Profile Image Route
router.put(
  "/profile/image",
  ensureAuthenticated,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.redirect("/");
    }

    User.findOne({ _id: req.user.id }).then(user => {
      cloudinary.uploader.upload(req.file.path, result => {
        req.body.image = result.secure_url;

        // Save new image to user
        user.image = req.body.image;
        user
          .save()
          .then(user => {
            res.redirect("/user/profile");
          })
          .catch(err => {
            req.flash("error_msg", "Something went wrong");
            return res.redirect("/");
          });
      });
    });
  }
);

// Delete Profile Image Route
router.put("/profile/image/delete", ensureAuthenticated, (req, res) => {
  User.findOne({ _id: req.user.id }).then(user => {
    // Change avatar to default image
    user.image =
      "https://sohe.wisc.edu/wordpress/wp-content/uploads/Male-Avatar.png";

    user
      .save()
      .then(user => {
        res.redirect("/user/profile");
      })
      .catch(err => {
        req.flash("error_msg", "Something went wrong");
        return res.redirect("/");
      });
  });
});

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

// Delete Image
router.delete("/post/image/:id", ensureAuthenticated, (req, res) => {
  Post.findById(req.params.id, async function(err, post) {
    cloudinary.v2.api.delete_resources(post.image, (err, result) => {
      if (err) {
        console.log(err);
      }
      post.image = "";
      post.save().then(post => {
        console.log(post.image);
        res.render("posts/edit", { post: post, Categories: Categories });
      });
    });
  });
});

module.exports = router;
