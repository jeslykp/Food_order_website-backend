const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: {
      type: [orderItemSchema],
      validate: v => Array.isArray(v) && v.length > 0,
      required: true,
    },
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Preparing", "Out for delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod" },
    paymentType: {
      type: String,
      enum: ["Cash on Delivery", "Card", "UPI", "Wallet"],
      default: "Cash on Delivery",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
