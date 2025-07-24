const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const User = require('../models/User');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'name email');
    if (!product) return res.status(404).send("Item not found");
    const user = await User.findById(req.session.user._id);
    res.render('item-details', { username:user.name, product, session: req.session, successMessage: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get('/postnew', async (req, res) => {
  if (!req.session.user) {
    return res.send(`<script>alert("Please login first."); window.location.href = "/";</script>`);
  }
  const user = await User.findById(req.session.user._id);
  res.render('postnew',{username:user.name});
});

router.post('/post-item', upload.single('itemImage'), async (req, res) => {
  if (!req.session.user.isSeller || !req.session.user.sellerDetails.isApprovedByAdmin) {
    return res.send(`<script>alert("You are not approved as seller yet!"); window.location.href = "/dashboard";</script>`);
  }

  try {
    const { title, description, price, category } = req.body;
    const imagePath = '/uploads/' + req.file.filename;
    const cleanPrice = Number((price || '').replace(/[^0-9.-]+/g, ""));
    const newProduct = new Product({
      title,
      description,
      price: cleanPrice,
      category,
      imageUrl: imagePath,
      sellerId: req.session.user._id
    });

    await newProduct.save();
    res.send(`<script>alert("Item posted successfully!"); window.location.href = "/dashboard";</script>`);
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).send("Failed to post item");
  }
});

router.get('/mylistings', async (req, res) => {
  const userId = req.session.user?._id;
  const user = await User.findById(req.session.user._id);
  if (!userId) return res.status(401).send("Please login first to view your listings.");
  try {
    const myProducts = await Product.find({ sellerId: userId });
    res.render("mylistings", { username:user.name,listings: myProducts });
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).send("Server error");
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.send(`<script>alert("Product not found."); window.location.href = "/";</script>`)
    const user = await User.findById(req.session.user._id);
    res.render('edit', {username:user.name, product});
  } catch (err) {
    console.error("Error loading edit page:", err);
    res.status(500).send("Server error");
  }
});

router.put('/edit/:id', async (req, res) => {
  const { title, price, category, description, imageUrl } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { title, price, category, description, imageUrl });
  res.send(`<script>alert("Updated successfully."); window.location.href = "/";</script>`);
  res.redirect('/mylistings');
});

router.post('/delete/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send(`<script>alert("Deleted successfully."); window.location.href = "/";</script>`);
    res.redirect('/mylistings');
  } catch (err) {
    console.error("Delete error:", err);
    res.send("Failed to delete product");
  }
});

module.exports = router;