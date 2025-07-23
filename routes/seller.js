const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/become-seller', async (req, res) => {
  if (!req.session.user?._id) return res.redirect('/login');
  const user = await User.findById(req.session.user._id);
  if (user.isSeller) {
    return res.send("You're already a seller!");
  }
  res.render('becomeSeller');
});

router.post('/become-seller', async (req, res) => {
  const { contactNo, upiId } = req.body;
  const user = await User.findById(req.session.user._id);
  if (!user) return res.redirect('/login');

  user.sellerDetails = {
    contactNo,
    upiId,
    isApprovedByAdmin: false
  };

  await user.save();
  res.send(`<script>alert("Seller application submitted! Please wait for admin approval."); window.location.href = "/dashboard";</script>`);
});

module.exports = router;
