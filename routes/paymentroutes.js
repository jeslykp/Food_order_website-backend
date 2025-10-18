import express from "express";
import { createPayment } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

router.post("/create", createPayment);

module.exports = paymentRouter;
