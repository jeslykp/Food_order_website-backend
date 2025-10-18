import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod" },
    amount: { type: Number, required: true },
    methodType: {
      type: String,
      enum: ["Cash on Delivery", "Card", "UPI", "Wallet"],
      default: "Cash on Delivery",
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
