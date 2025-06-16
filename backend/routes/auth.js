const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  getCurrentUser,
  login,
  register,
  getAllUsers,
} = require("../controllers/authController");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get current user
router.get("/me", auth, getCurrentUser);

// Get all users (for managers)
router.get("/users", auth, getAllUsers);

module.exports = router;
