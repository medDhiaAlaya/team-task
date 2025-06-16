const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ username, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const userData = { id: user.id, username: user.username, role: user.role };
    const payload = { user: userData };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const userData = { id: user._id, username: user.username, role: user.role };
    const payload = { user: userData };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, user: userData });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    res.json({ user });
  } catch (err) {
    res.status(500).send("Server error");
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    // Only allow managers to fetch users
    if (req.user.role !== "manager")
      return res.status(403).json({ msg: "Access denied" });
    const users = await User.find({}, "username role");
    res.json(users);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
