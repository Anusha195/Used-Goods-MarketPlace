const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/add-address', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');

    const user = await User.findById(req.session.user._id);
    const addresses = user.addresses || [];

    res.render('addAddress', { username:user.name, addresses, message: null });
  } catch (err) {
    console.error("Error fetching address:", err);
    res.status(500).send("Error loading address page.");
  }
});

router.post('/add-address', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');

    const { addressLine, city, state, zip, country } = req.body;
    const newAddress = { addressLine, city, state, zip, country };

    await User.findByIdAndUpdate(req.session.user._id, {
      $push: { addresses: newAddress }
    });

    const updatedUser = await User.findById(req.session.user._id);
    res.render('addAddress', {
      addresses: updatedUser.addresses,
      message: 'Address saved successfully!'
    });
  } catch (err) {
    console.error("Error saving address:", err);
    res.status(500).send("Error saving address.");
  }
});

module.exports = router;
