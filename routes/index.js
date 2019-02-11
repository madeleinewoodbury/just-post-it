const express = require("express");
const router = express.Router();

// Home Route
router.get("/", (req, res) => {
  res.render("dashboard");
});

// Users Route
router.get("/users", (req, res) => {
  res.render("users");
});

// Posts Route
router.get("/posts", (req, res) => {
  res.render("posts");
});

// Categories Route
router.get("/categories", (req, res) => {
  res.render("categories");
});

module.exports = router;
