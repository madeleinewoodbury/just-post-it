const express = require("express");
const router = express.Router();

// Login Route
router.get("/register", (req, res) => {
  res.render("user/register");
});

// Reguster Route
router.get("/login", (req, res) => {
  res.render("user/login");
});

// Profile Route
router.get("/", (req, res) => {
  res.render("user/profile");
});

module.exports = router;
