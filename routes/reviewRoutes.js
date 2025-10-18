const express = require("express");

const reviewRouter = express.Router();

reviewRouter.get("/restaurants/:restaurantId/reviews", getRestaurantReviews);

reviewRouter.post(
  "/restaurants/:restaurantId/reviews",
  createReview
);

reviewRouter.delete("/reviews/:id", deleteReview);

module.exports = reviewRouter;
