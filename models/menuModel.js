import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);
