import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      trim: true 
    },
    image: { 
      type: String, 
      default: "" 
    },
    address: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String 
    },
    categories:{
      type: [String],
      default: []
    },
    deliveryCharge: { 
      type: Number, 
      default: 0 
    },
    reviews: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Review" 
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
