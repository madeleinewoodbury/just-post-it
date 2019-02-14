const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../helpers/auth");

// Landing Page/Dashboard Route
router.get("/", (req, res) => {
  if (req.user) {
    res.render("index/dashboard");
  } else {
    res.render("home");
  }
});

// Users Route
router.get("/users", ensureAuthenticated, (req, res) => {
  res.render("index/users");
});

// Posts Route
router.get("/posts", ensureAuthenticated, (req, res) => {
  res.render("index/posts");
});

// Categories Route
router.get("/categories", ensureAuthenticated, (req, res) => {
  res.render("index/categories");
});

// Profile Route
router.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("index/profile");
});

module.exports = router;
