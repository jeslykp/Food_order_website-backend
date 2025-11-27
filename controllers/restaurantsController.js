const Restaurant = require("../models/restaurantModel");
const MenuItem = require("../models/menuModel");
const cloudinary = require("../config/cloudinary");

// GET /api/restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/restaurants/:id
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItems = await MenuItem.find({ restaurant: restaurant._id });

    res.status(200).json({ restaurant, menuItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
//   POST /api/restaurants
//  Private/Admin

const createRestaurant = async (req, res) => {
  try {
    const { name, description, address, phone, categories, deliveryCharge } =
      req.body;
    let imageUrl = "";
    if (req.file) {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.file.path
      );
      imageUrl = cloudinaryResponse.secure_url;
    }
    let parsedCategories = categories;

    if (typeof categories === "string") {
      try {
        parsedCategories = JSON.parse(categories);
      } catch (error) {
        console.error("Failed to parse categories:", error);
        return res.status(400).json({ message: "Invalid categories format" });
      }
    }
    const newRestaurant = new Restaurant({
      name,
      description,
      image: imageUrl || "",
      address,
      phone,
      categories: parsedCategories || [],
      deliveryCharge: deliveryCharge || 0,
      createdBy: req.admin.id,
    });

    const savedRestaurant = await newRestaurant.save();

    res.status(201).json({
      message: "Restaurant created successfully",
      savedRestaurant,
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  PUT /api/restaurants/:id
// Admin
const updateRestaurant = async (req, res) => {
  try {

    const { name, description, address, phone, categories, deliveryCharge } =
      req.body;

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // ----- Handle image upload -----
    let imageUrl = restaurant.image; // keep old image if no update

    if (req.file) {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.file.path
      );
      imageUrl = cloudinaryResponse.secure_url;
    }

    // ----- Parse categories -----
    let parsedCategories = categories;

    if (typeof categories === "string") {
      try {
        parsedCategories = JSON.parse(categories);
      } catch (error) {
        console.error("Failed to parse categories:", error);
        return res.status(400).json({ message: "Invalid categories format" });
      }
    }

    // ----- Update restaurant -----
    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.image = imageUrl;
    restaurant.address = address || restaurant.address;
    restaurant.phone = phone || restaurant.phone;
    restaurant.categories = parsedCategories || restaurant.categories;
    restaurant.deliveryCharge =
      deliveryCharge !== undefined
        ? deliveryCharge
        : restaurant.deliveryCharge;

    const updatedRestaurant = await restaurant.save();

    res.status(200).json({
      message: "Restaurant updated successfully",
      updatedRestaurant,
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//  DELETE /api/restaurants/:id
// Admin
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
