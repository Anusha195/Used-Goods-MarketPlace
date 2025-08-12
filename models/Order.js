const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    address: {
      addressLine: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    paymentMethod: String,
    deliveryStatus: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    approvedStatus: {
      type: String,
      enum: ["Waiting", "Approved", "Rejected"],
      default: "Waiting",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid","Pending"],
      default: "Unpaid",
    },
    utrId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
