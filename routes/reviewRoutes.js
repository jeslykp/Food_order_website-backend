const express = require("express");
const {
  getRestaurantReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");
const authUser = require("../middlewares/authUser");

const router = express.Router();

router.get("/:restaurantId", getRestaurantReviews);

router.post("/:restaurantId", authUser, createReview);

router.delete("/:id", authUser, deleteReview);

module.exports = router;
