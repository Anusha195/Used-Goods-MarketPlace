const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  addressLine: String,
  city: String,
  state: String,
  zip: String,
  country: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isSeller: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  addresses: [addressSchema],
  sellerDetails: {
    contactNo: String,
    upiId: String,
    isApprovedByAdmin: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model("User", userSchema);
