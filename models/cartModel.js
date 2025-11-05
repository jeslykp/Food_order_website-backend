const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    items: { type: [cartItemSchema], default: [] },
    totalAmount: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },     
    deliveryFee: { type: Number, default: 0 },   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
