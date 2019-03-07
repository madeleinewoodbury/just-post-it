const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

// Load User Model
require("../models/User");
const User = mongoose.model("users");
require("../models/Post");
const Post = mongoose.model("posts");

// Register Route
router.get("/register", (req, res) => {
  res.render("user/register");
});

// Login Route
router.get("/login", (req, res) => {
  res.render("user/login");
});

// Login from POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true
  })(req, res, next);
});

// Process Register Form Route
router.post("/register", (req, res) => {
  // Server side validation
  let errors = [];

  if (!req.body.name) {
    errors.push({ text: "Please add a name" });
  }
  if (!req.body.email) {
    errors.push({ text: "Please add an email" });
  }
  if (!req.body.password) {
    errors.push({ text: "Please add a password" });
  } else if (req.body.password.length < 5) {
    errors.push({ text: "Password must be at least 5 characters" });
  } else if (req.body.password !== req.body.password2) {
    errors.push({ text: "Passwords needs to match" });
  }

  if (errors.length > 0) {
    res.render("user/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    // Check if email is already registered in the db
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already registered");
        res.redirect("/user/register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        // Encrypt passord with bcrypt
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/user/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// Logout User
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/user/login");
});

// Profile Route
router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("user/profile");
});

// Edit User Process
router.put("/profile/edit", ensureAuthenticated, (req, res) => {
  User.findOne({ email: req.user.email }).then(user => {
    // New values
    user.name = req.body.name;
    user.email = req.body.email;
    user.bio = req.body.bio;

    user.save().then(user => {
      res.redirect("/");
    });
  });
});

// Update User Password GET ROUTE
router.post("/profile/password", ensureAuthenticated, (req, res, next) => {
  if (req.user.email !== req.body.email) {
    req.flash("error_msg", "Incorrect Email");
    res.redirect("/user/profile");
  } else {
    passport.authenticate("local", {
      successRedirect: "/user/profile/reset",
      failureRedirect: "/user/profile",
      failureFlash: true
    })(req, res, next);
  }
});

router.get("/profile/reset", ensureAuthenticated, (req, res) => {
  res.render("user/reset");
});

// Update User Password PUT ROUTE
router.put("/profile/reset", ensureAuthenticated, (req, res) => {
  // Server side validation
  let errors = [];

  if (!req.body.password) {
    errors.push({ text: "Please add a password" });
  } else if (req.body.password.length < 5) {
    errors.push({ text: "Password must be at least 5 characters" });
  } else if (req.body.password !== req.body.password2) {
    errors.push({ text: "Passwords needs to match" });
  }

  if (errors.length > 0) {
    res.render("user/reset");
  } else {
    User.findOne({ email: req.user.email }).then(user => {
      // Reset Password
      user.password = req.body.password;

      // Encrypt passord with bcrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user
            .save()
            .then(user => {
              req.flash("success_msg", "Password has been reset");
              res.redirect("/user/login");
            })
            .catch(err => {
              console.log(err);
              return;
            });
        });
      });
    });
  }
});

// Search for users route
router.post("/search", ensureAuthenticated, (req, res) => {
  let searchValue = req.body.search;
  searchValue = searchValue.charAt(0).toUpperCase() + searchValue.slice(1);
  let users = [];

  User.find()
    .sort({ name: "asc" })
    .then(result => {
      for (user of result) {
        if (user.name.includes(searchValue)) {
          users.push(user);
        }
      }
      res.render("index/users", { users: users });
    });
});

// Delete User Account
router.delete("/delete", ensureAuthenticated, (req, res) => {
  // Find all posts by user and delete from database
  Post.deleteMany({ user: req.user.id })
    .then(() => {
      // Delete user from database
      User.deleteOne({ _id: req.user.id })
        .then(() => {
          req.flash("success_msg", "Account successfully deleted");
          res.redirect("/user/login");
        })
        .catch(err => {
          req.flash("err_msg", "Something went wrong");
          res.redirect("/");
        });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
