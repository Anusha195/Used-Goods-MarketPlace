const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const items = await Product.find({ isSold: false }).populate('sellerId').limit(10);
    res.render('home', { items });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server error');
  }
});

router.get('/dashboard', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  try {
    const currentUser = await User.findById(req.session.user._id);

    if (req.session.user.isAdmin) {
      const users = await User.find();
      const products = await Product.find().populate('sellerId');
      const requests = await User.find({ isSeller: false, 'sellerDetails.isApprovedByAdmin': false });
      return res.render('admin-dashboard', { users, products, requests });
    }

    const { search, category, min, max } = req.query;
    const filter = { isSold: false };

    if (search) filter.title = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    if (min || max) {
      filter.price = {};
      if (min) filter.price.$gte = parseInt(min);
      if (max) filter.price.$lte = parseInt(max);
    }

    const products = await Product.find(filter).limit(10);

    return res.render('dashboard', {
      username: currentUser.name,
      products
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send("Error loading dashboard");
  }
});


router.get('/load-more', async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;

  try {
    const moreItems = await Product.find({ isSold: false })
      .populate('sellerId')
      .skip(skip)
      .limit(10);

    res.json(moreItems);
  } catch (err) {
    console.error('Error loading more items:', err);
    res.status(500).json({ error: 'Failed to load more items' });
  }
});

module.exports = router;
