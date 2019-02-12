const express = require("express");
const router = express.Router();

// Home/Landing Page Route
router.get("/home", (req, res) => {
  res.render("home");
});

// Dashboard Route
router.get("/", (req, res) => {
  res.render("index/dashboard");
});

// Users Route
router.get("/users", (req, res) => {
  res.render("index/users");
});

// Posts Route
router.get("/posts", (req, res) => {
  res.render("index/posts");
});

// Categories Route
router.get("/categories", (req, res) => {
  res.render("index/categories");
});

module.exports = router;
