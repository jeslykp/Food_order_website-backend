const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  dashboard,
} = require("../controllers/adminController");
const authAdmin = require("../middleware/authAdmin");

const adminRouter = express.Router();

// Public routes
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);



// Protected admin routes
adminRouter.post("/logout", authAdmin, logoutAdmin);
adminRouter.get("/profile", authAdmin, getAdminProfile);
adminRouter.get("/dashboard", authAdmin, dashboard);





module.exports = adminRouter;
