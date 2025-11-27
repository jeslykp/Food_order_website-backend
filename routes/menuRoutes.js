const express = require("express");
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemsByRestaurant,
} = require("../controllers/menuController.js");
const authAdmin = require("../middlewares/authAdmin");
const upload = require("../middlewares/multer.js");

const menuRouter = express.Router();

menuRouter.get("/restaurant/:restaurantId", getMenuItemsByRestaurant);
menuRouter.get("/:id", getMenuItemById);

menuRouter.post("/add", authAdmin, upload.single("image"), createMenuItem);
// menuRouter.put("/:id", authAdmin, updateMenuItem);
menuRouter.put("/:id", authAdmin, upload.single("image"), updateMenuItem);

menuRouter.get("/", authAdmin, getAllMenuItems);

menuRouter.delete("/:id", authAdmin, deleteMenuItem);

module.exports = menuRouter;
