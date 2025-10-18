const express = require("express");

const restaurantRouter = express.Router();

restaurantRouter.get("/api/restaurants", getAllRestaurants); //List all restaurants
restaurantRouter.get("/api/restaurants/:id", getRestaurantById); //Get restuarant details


restaurantRouter.post("/api/restaurants", createRestaurant); //admin
restaurantRouter.put("/api/restaurants/:id", updateRestaurant); //admin
restaurantRouter.delete("/api/restaurants/:id", deleteRestaurant); //admin


module.exports = restaurantRouter