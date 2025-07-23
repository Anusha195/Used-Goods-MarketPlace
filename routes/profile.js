const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/edit-profile', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  const user = await User.findById(req.session.user._id);
  res.render('editprofile', { user });
});

router.post('/edit-profile', async (req, res) => {
  const { name, email, contactNo } = req.body;
  const user = await User.findById(req.session.user._id);

  if (!user) return res.redirect('/login');

  user.name = name;
  user.email = email;
  if (user.sellerDetails) {
    user.sellerDetails.contactNo = contactNo;
  }

  await user.save();
  res.redirect('/dashboard');
});

module.exports = router;
