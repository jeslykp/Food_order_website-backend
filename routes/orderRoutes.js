const express = require("express");

const orderRouter = express.Router();

orderRouter.get("/api/orders", getAllOrders); //admin

orderRouter.get("/api/orders/user", getUserOrders); //order by a user

orderRouter.post("/api/orders", createOrder);

orderRouter.delete("/api/orders/:id", cancelOrder); //Cancellation

module.exports = orderRouter;
