const express = require("express");

const menuRouter = express.Router();

menuRouter.get("/api/menus", getAllMenuItems);
menuRouter.get("/api/menus/:id", getMenuItemById);

menuRouter.post("/api/menus", createMenuItem);
menuRouter.put("/api/menus/:id", updateMenuItem);
menuRouter.delete("/api/menus/:id", deleteMenuItem);

module.exports = menuRouter;