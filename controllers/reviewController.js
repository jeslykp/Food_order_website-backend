const Review = require("../models/reviewModel");

// GET all reviews for a restaurant
const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE a review
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Prevent duplicate review by same user
    const existing = await Review.findOne({
      user: req.user.id,
      restaurant: req.params.restaurantId,
    });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this restaurant" });
    }

    const review = new Review({
      user: req.user.id,
      restaurant: req.params.restaurantId,
      rating,
      comment,
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Only author or admin can delete
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review removed" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getRestaurantReviews,
  createReview,
  deleteReview,
};
