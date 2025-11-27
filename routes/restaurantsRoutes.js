const express = require("express");
const authAdmin = require("../middlewares/authAdmin");
const upload = require("../middlewares/multer.js");

const {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantById,
} = require("../controllers/restaurantsController");

const restaurantRouter = express.Router();

restaurantRouter.get("/", getAllRestaurants); //List all restaurants
restaurantRouter.get("/:id", getRestaurantById); //get restaurant by id

restaurantRouter.post(
  "/add",
  authAdmin,
  upload.single("image"),
  createRestaurant
); //admin
restaurantRouter.put("/:id", authAdmin, upload.single("image"), updateRestaurant);
restaurantRouter.delete("/:id", authAdmin, deleteRestaurant); //admin

module.exports = restaurantRouter;
