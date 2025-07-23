const express = require('express');
require('dotenv').config();
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Middleware
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// Route Imports
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const productRoutes = require('./routes/product');
const sellerRoutes = require('./routes/seller');
const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/admin');
const addressRoutes = require('./routes/address');
const profileRoutes = require('./routes/profile');



// Route Usage
app.use(profileRoutes);
app.use(authRoutes);
app.use(dashboardRoutes);
app.use(productRoutes);
app.use(sellerRoutes);
app.use(orderRoutes);
app.use(adminRoutes);
app.use(addressRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
