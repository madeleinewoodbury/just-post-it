const express = require("express");
const mongoose = require("mongoose");
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

// Profile Route
router.get("/", (req, res) => {
  res.render("user/profile");
});

// Process Register Form Route
router.post("/register", (req, res) => {
  let errors = [];

  if (!req.body.name) {
    errors.push({ text: "Please add a name" });
  }
  if (!req.body.email) {
    errors.push({ text: "Please add an email" });
  }
  if (!req.body.password) {
    errors.push({ text: "Please add a password" });
  }
  if (req.body.password !== req.body.password2) {
    errors.push({ text: "Passwords needs to match" });
  }

  if (errors.length > 0) {
    res.render("user/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    newUser
      .save()
      .then(user => {
        console.log(user);
        res.redirect("/user/login");
      })
      .catch(err => console.log(err));
  }
});

module.exports = router;
