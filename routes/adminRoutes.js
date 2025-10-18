const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../controllers/adminController");

const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/logout", logoutAdmin);

adminRouter.get("/profile", getAdminProfile);
adminRouter.get("/dashboard", dashboard);

adminRouter.get("/api/admin/users", getAllUsers);
adminRouter.get("/api/admin/restaurants", getAllAdminRestaurants);
adminRouter.get("/api/admin/orders", getAllAdminOrders);

module.exports = adminRouter;
