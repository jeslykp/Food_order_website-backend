
const express = require("express");
const {
  addToCart,
  updateQuantity,
  removeItem,
  getCart,
  checkout,
} = require("../controllers/cartController");
const authUser = require("../middlewares/authUser");


const cartRouter = express.Router();
cartRouter.post("/add-to-cart", authUser, addToCart);
cartRouter.put("/update-cart", authUser, updateQuantity);
cartRouter.delete("/remove/:menuItemId",authUser,  removeItem);
cartRouter.get("/",  authUser,getCart);

cartRouter.post("/checkout",authUser, checkout);

module.exports =  cartRouter;
