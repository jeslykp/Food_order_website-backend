const express = require("express");
const {
  getRestaurantReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");
const authUser = require("../middlewares/authUser");

const reviewRouter = express.Router();

reviewRouter.get("/:restaurantId",authUser, getRestaurantReviews);

reviewRouter.post("/:restaurantId", authUser,createReview);

reviewRouter.delete("/:id",authUser, deleteReview);

module.exports = reviewRouter;
