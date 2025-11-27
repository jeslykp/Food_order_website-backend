const MenuItem = require("../models/menuModel");
const cloudinary = require("../config/cloudinary");

//     Get all menu items
//    GET /api/menus
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({});
    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//     Get single menu item by ID
//    GET /api/menus/:id
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//     Create new menu item
//    POST /api/menus
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, restaurant } = req.body;
    let imageUrl = "";
    if (req.file) {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.file.path
      );
      imageUrl = cloudinaryResponse.secure_url;
    }

    const newMenuItem = new MenuItem({
      name,
      description,
      price,
      category,
      restaurant,
      image: imageUrl,
      createdBy: req.admin.id,
    });

    const savedMenuItem = await newMenuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
//     Update menu item
//    PUT /api/menus/:id
const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Update text fields
    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.category = category || menuItem.category;

    // Update image if uploaded
    if (req.file) {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.file.path,
        { folder: "restaurant_menu", use_filename: true, unique_filename: false }
      );
      menuItem.image = cloudinaryResponse.secure_url;
    }

    const updatedMenuItem = await menuItem.save();
    res.status(200).json(updatedMenuItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


//     Delete menu item
//    DELETE /api/menus/:id

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menuItems = await MenuItem.find({ restaurant: restaurantId });
    res.status(200).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByRestaurant,
};
