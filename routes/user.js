const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

// Load User Model
require("../models/User");
const User = mongoose.model("users");

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

// Profile Route
router.get("/", (req, res) => {
  res.render("user/profile");
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

module.exports = router;
