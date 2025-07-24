const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

router.post('/order/:id', async (req, res) => {
  if (!req.session.user) {
    return res.send(`<script>alert("Please Login first."); window.location.href = "/";</script>`);
  }

  try {
    const product = await Product.findById(req.params.id).populate('sellerId');
    if (!product) {
      return res.send(`<script>alert("Item not found."); window.location.href = "/dashboard";</script>`);
    }

    const order = new Order({
      productId: product._id,
      buyerId: req.session.user._id,
      sellerId: product.sellerId._id,
      status: 'Pending',
    });

    await order.save();

    res.render('item-details', {
      product,
      session: req.session,
      successMessage: "Order placed successfully!"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Order failed");
  }
});

router.get('/checkout/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    const seller = await User.findById(product.sellerId);
    const user = await User.findById(req.session.user._id);
    const success = req.query.success === 'true';

    res.render('checkout', {
      username:user.name,
      product,
      addresses: user.addresses || [],
      success,
      seller
    });
  } catch (err) {
    console.error('Checkout load error:', err);
    res.status(500).send('Error loading checkout');
  }
});

router.post('/place-order', async (req, res) => {
  const { productId, addressIndex, paymentMethod, utrId } = req.body;

  try {
    const user = await User.findById(req.session.user._id);
    const product = await Product.findById(productId);

    if (!product) return res.status(404).send('Product not found');

    const selectedAddress = user.addresses[addressIndex];
    if (!selectedAddress) return res.status(400).send('Invalid address selected');

    const newOrder = new Order({
      buyerId: user._id,
      sellerId: product.sellerId,
      productId: product._id,
      address: selectedAddress,
      paymentMethod,
      deliveryStatus: 'Pending',
      approvedStatus: 'Waiting',
      paymentStatus: paymentMethod === 'UPI' ? 'Pending' : 'Unpaid',
      utrId: paymentMethod === 'UPI' ? utrId : undefined
    });

    await newOrder.save();
    res.redirect(`/checkout/${productId}?success=true`);
  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).send('Error placing order');
  }
});

router.get('/orders', async (req, res) => {
  if (!req.session.user?._id) return res.redirect('/login');
  

  try {
    const userId = req.session.user._id;
    const user=await User.findById(req.session.user._id);
    const ordersPlaced = await Order.find({ buyerId: userId }).populate('productId').populate('sellerId');
    const ordersReceived = await Order.find({ sellerId: userId }).populate('productId').populate('buyerId');

    res.render('myorders', {
      username:user.name,
      ordersPlaced,
      ordersReceived,
      session: req.session
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching orders");
  }
});

router.post('/orders/:id/update', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const { paymentStatus, deliveryStatus, approvedStatus } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { paymentStatus, deliveryStatus, approvedStatus });
    res.redirect('/orders');
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).send("Failed to update order");
  }
});

router.post('/cancel-order/:id', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  try {
    const order = await Order.findById(req.params.id);

    if (!order || order.buyerId.toString() !== req.session.user._id.toString()) {
      return res.status(403).send("Unauthorized or order not found");
    }

    if (order.deliveryStatus === 'Shipped' || order.deliveryStatus === 'Delivered') {
      return res.status(400).send("Cannot cancel after shipment");
    }

    order.deliveryStatus = 'Cancelled';
    await order.save();
    res.send(`<script>alert("Order cancelled successfully!"); window.location.href = "/orders";</script>`); // ✅ Option 2: Alert + redirect

  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
