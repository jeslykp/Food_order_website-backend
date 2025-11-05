const Order = require("../models/orderModel");
const Restaurant = require("../models/restaurantModel.js");
const Cart = require("../models/cartModel.js");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createOrder = async (req, res) => {
  try {

    const { restaurantId, items, deliveryAddress, paymentType, paymentMethod } =
      req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee = restaurant.deliveryCharge || 0;
    const finalAmount = totalAmount + deliveryFee;

    const order = new Order({
      user: req.user.id,
      restaurant: restaurantId,
      items,
      totalAmount: finalAmount,
      deliveryAddress,
      paymentType: paymentType || "Cash on Delivery",
      paymentMethod: paymentMethod || null,
      status: "Pending",
      paymentStatus: "Pending",
    });

    const createdOrder = await order.save();

    await Cart.deleteOne({ user: req.user.id });

    res.status(201).json({
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Cannot cancel paid order" });
    }

    await Order.deleteOne({ _id: order._id });

    res.status(200).json({ message: "Order cancelled" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  createOrder,
  cancelOrder,
};
