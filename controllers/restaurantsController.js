const Restaurant = require("../models/restaurantModel");
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

    res.status(200).json(restaurant);
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
      // console.log("Cloudinary response:", cloudinaryResponse);
    }

    const newRestaurant = new Restaurant({
      name,
      description,
      image: imageUrl || "",
      address,
      phone,
      categories: categories || [],
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
    const { name, description, location, cuisineType, openingHours } = req.body;

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.location = location || restaurant.location;
    restaurant.cuisineType = cuisineType || restaurant.cuisineType;
    restaurant.openingHours = openingHours || restaurant.openingHours;

    const updatedRestaurant = await restaurant.save();
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
