const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ensureAuthenticated } = require("../helpers/auth");
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

router.post(
  "/image",
  ensureAuthenticated,
  upload.single("image"),
  (req, res) => {
    cloudinary.uploader.upload(req.file.path, result => {
      req.body.image = result.secure_url;

      const newImage = new Image({ path: req.body.image });

      newImage
        .save()
        .then(image => {
          res.render("image", { image: image });
        })
        .catch(err => {
          req.flash("error_msg", "Something went wrong");
          return res.redirect("/");
        });
    });
  }
);

module.exports = router;

// Set The Storage Engine
// const storage = multer.diskStorage({
//   destination: "./public/uploads/",
//   filename: function(req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   }
// });

// Init Upload
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 3000000 },
//   fileFilter: function(req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).single("imageFile");

// // Check File Type
// function checkFileType(file, cb) {
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only!");
//   }
// }

// router.get("/", (req, res) => res.render("upload"));

// router.post("/image", parser.single("image"), (req, res) => {
//   console.log(req.file); // to see what is returned to you
//   const image = {};
//   image.url = req.file.url;
//   image.id = req.file.public_id;
//   Image.create(image) // save image information in database
//     .then(newImage => res.json(newImage))
//     .catch(err => console.log(err));
// });

// router.post("/", ensureAuthenticated, (req, res) => {
//   upload(req, res, err => {
//     if (err) {
//       console.log(err);
//       res.render("user/profile");
//     } else {
//       if (req.file == undefined) {
//         req.flash("error_msg", "No File Selected");
//         res.render("user/profile");
//       } else {
//         // res.render("upload", {
//         //   file: `uploads/${req.file.filename}`
//         // });
//         // Save fileto current user
//         User.findOne({ _id: req.user.id }).then(user => {
//           user.image = req.file.filename;

//           user.save().then(user => {
//             req.flash("success_msg", "Image Uploaded");
//             res.redirect("/user/profile");
//           });
//         });
//       }
//     }
//   });
// });
