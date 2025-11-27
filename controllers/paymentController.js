const Stripe = require("stripe");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

// Just a single frontend URL from env
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.menuItem"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    console.log(cart, "====cart");

    const lineItems = [
      // Cart items
      ...cart.items.map((item) => ({
        price_data: {
          currency: "aed",
          product_data: {
            name: item.menuItem.name,
            images: [],
          },
          unit_amount: Math.round(item.menuItem.price * 100),
        },
        quantity: item.quantity,
      })),

      // Service Fee
      ...(cart.serviceFee
        ? [
            {
              price_data: {
                currency: "aed",
                product_data: { name: "Service Fee" },
                unit_amount: Math.round(cart.serviceFee * 100),
              },
              quantity: 1,
            },
          ]
        : []),

      // Delivery Fee
      ...(cart.deliveryFee
        ? [
            {
              price_data: {
                currency: "aed",
                product_data: { name: "Delivery Fee" },
                unit_amount: Math.round(cart.deliveryFee * 100),
              },
              quantity: 1,
            },
          ]
        : []),
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${FRONTEND_URL}/order-confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/order-summary`,
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const verifyCheckoutSession = async (req, res) => {
  try {
    const { session_id } = req.query;
    const userId = req.user?.id;

    if (!session_id)
      return res.status(400).json({ message: "Session ID is required" });
    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });

    if (session.payment_status === "paid") {
      const cart = await Cart.findOne({ user: userId }).populate(
        "items.menuItem"
      );
      if (!cart || cart.items.length === 0)
        return res.status(400).json({ message: "Cart is empty" });

      const order = await Order.create({
        user: userId,
        restaurant: cart.restaurant,
        items: cart.items.map((item) => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity,
          price: item.menuItem.price,
        })),
        totalAmount:
          cart.totalAmount + (cart.serviceFee || 0) + (cart.deliveryFee || 0),
        serviceFee: cart.serviceFee || 0,
        deliveryFee: cart.deliveryFee || 0,
        status: "completed",
      });

      await Cart.updateOne(
        { user: userId },
        { $set: { items: [], totalAmount: 0, serviceFee: 0, deliveryFee: 0 } }
      );

      return res.status(200).json({
        success: true,
        payment_status: session.payment_status,
        order,
        message: "Payment successful and order created",
      });
    }

    res
      .status(200)
      .json({ success: true, payment_status: session.payment_status, session });
  } catch (error) {
    console.error("Error verifying checkout session:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { createCheckoutSession, verifyCheckoutSession };
