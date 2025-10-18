import express from "express";
import {
  addToCart,
  updateQuantity,
  removeItem,
  getCart,
  checkout,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const cartRouter = express.Router();

cartRouter.post("/add",  addToCart);
cartRouter.put("/update",  updateQuantity);
cartRouter.delete("/remove/:menuItemId",  removeItem);
cartRouter.get("/",  getCart);

cartRouter.post("/checkout", checkout);

export default router;
