const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return res.send(`<script>alert("Passwords do not match."); window.location.href = "/";</script>`);

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.send(`<script>alert("User already exists."); window.location.href = "/";</script>`);

    const user = new User({ name, email, password });
    await user.save();
    res.send(`<script>alert("Registration successful! Please login."); window.location.href = "/";</script>`);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Failed to register user');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.send(`<script>alert("Invalid Credentials."); window.location.href = "/";</script>`);

    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isSeller: user.isSeller,
      isAdmin: user.isAdmin,
      sellerDetails: user.sellerDetails
    };

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Login error');
  }
});

module.exports = router;
