const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");
const restaurantRouter = require("./restaurantsRoutes");
const reviewRouter = require("./reviewRoutes");
const menuRouter = require("./menuRoutes");
const cartRouter = require("./cartRoutes");
const orderRouter = require("./orderRoutes");
const paymentRouter = require("./paymentRoutes");

router.use("/user", userRouter);
router.use("/restaurants", restaurantRouter);
router.use("/reviews", reviewRouter);
router.use("/menus", menuRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);
router.use("/payment", paymentRouter);

module.exports = router;
