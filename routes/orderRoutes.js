const express = require("express");
const {
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  createOrder,
  cancelOrder,
} = require("../controllers/orderController.js");
const  authUser  = require("../middlewares/authUser.js");
const authAdmin = require("../middlewares/authAdmin");

const orderRouter = express.Router();

orderRouter.get("/", authAdmin, getAllOrders); //admin
orderRouter.put("/:id/status", authAdmin, updateOrderStatus); 

orderRouter.get("/my-orders", authUser, getUserOrders); //order by a user
orderRouter.post("/create", authUser, createOrder);
orderRouter.delete("/:orderId",authUser, cancelOrder); //Cancellation

module.exports = orderRouter;
