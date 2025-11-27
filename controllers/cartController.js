import Cart from "../models/cartModel.js";
import MenuItem from "../models/menuModel.js";

//     Add item to cart
//    POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    // Verify menu item exists and populate restaurant
    const menuItem = await MenuItem.findById(menuItemId).populate("restaurant");
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const restaurant = menuItem.restaurant;

    // Find or create cart for user
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        restaurant: restaurant._id,
        items: [],
      });
    } else if (cart.restaurant.toString() !== restaurant._id.toString()) {
      return res.status(400).json({
        message: "You can only add items from one restaurant at a time",
      });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.menuItem.toString() === menuItemId
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        menuItem: menuItemId,
        quantity,
        price: menuItem.price,
      });
    }

    // Calculate totals
    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    cart.serviceFee = cart.totalAmount * 0.05;
    cart.deliveryFee = restaurant.deliveryCharge || 0;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//    Update item quantity in cart
// PUT /api/cart/update
const updateQuantity = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.menuItem.toString() === menuItemId
    );

    if (itemIndex < 0) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//     Remove item from cart
//   DELETE /api/cart/remove/:menuItemId
const removeItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== menuItemId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//    Get user's cart
//   GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.menuItem",
      "name price image"
    );

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//   Checkout cart
//   POST /api/cart/checkout
const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.menuItem"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    res.status(200).json({
      message: "Checkout successful",
      order: "Order details would be here",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Clear all cart fields
    cart.items = [];
    cart.totalAmount = 0;
    cart.serviceFee = 0;
    cart.deliveryFee = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export { addToCart, updateQuantity, removeItem, getCart, checkout ,clearCart};
