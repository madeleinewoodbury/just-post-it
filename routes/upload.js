const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");

// Load Post Model
require("../models/Post");
const Post = mongoose.model("posts");
require("../models/User");
const User = mongoose.model("users");

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("imageFile");

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

router.get("/", ensureAuthenticated, (req, res) => res.render("upload"));

router.post("/", ensureAuthenticated, (req, res) => {
  upload(req, res, err => {
    if (err) {
      console.log(err);
      res.render("user/profile");
    } else {
      if (req.file == undefined) {
        req.flash("error_msg", "No File Selected");
        res.render("user/profile");
      } else {
        // res.render("upload", {
        //   file: `uploads/${req.file.filename}`
        // });
        // Save fileto current user
        User.findOne({ _id: req.user.id }).then(user => {
          user.image = req.file.filename;

          user.save().then(user => {
            req.flash("success_msg", "Image Uploaded");
            res.redirect("/user/profile");
          });
        });
      }
    }
  });
});

module.exports = router;
