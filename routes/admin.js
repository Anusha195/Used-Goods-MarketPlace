const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

router.post('/admin/delete-user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    await Product.deleteMany({ sellerId: userId });
    return res.redirect('/dashboard');
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).send("Error deleting user");
  }
});


router.post('/admin/approve-seller/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      isSeller: true,
      isApprovedByAdmin: true
    });
    res.redirect('/dashboard');
  } catch (err) {
    console.error("Error approving seller:", err);
    res.status(500).send("Failed to approve seller");
  }
});

router.post('/admin/delete-product/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send("Failed to delete product");
  }
});


router.post('/admin/unblock-user/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
    return res.redirect('/dashboard');
  } catch (err) {
    return res.status(500).send("Error unblocking user");
  }
});

router.post('/admin/block-user/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
    return res.redirect('/dashboard');
  } catch (err) {
    return res.status(500).send("Error blocking user");
  }
});

module.exports = router;
