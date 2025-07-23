const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

router.get('/dashboard', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) return res.redirect('/login');

  try {
    const users = await User.find();
    const products = await Product.find().populate('sellerId');
    const requests = await User.find({ isSeller: false, sellerRequest: true });
    const orders = await Order.find().populate('productId buyerId sellerId');

    res.render('admin-dashboard', {
      users,
      products,
      requests,
      orders,
      session: req.session
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).send("Failed to load dashboard");
  }
});

router.post('/admin/delete-seller/:id', async (req, res) => {
  try {
    const sellerId = req.params.id;
    await Product.deleteMany({ sellerId });
    await User.findByIdAndDelete(sellerId);
    res.redirect('/dashboard');
  } catch (err) {
    console.error("Error deleting seller:", err);
    res.status(500).send("Failed to delete seller");
  }
});

router.post('/admin/approve-seller/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      isSeller: true,
      sellerRequest: false
    });
    res.redirect('/dashboard');
  } catch (err) {
    console.error("Error approving seller:", err);
    res.status(500).send("Failed to approve seller");
  }
});

module.exports = router;
