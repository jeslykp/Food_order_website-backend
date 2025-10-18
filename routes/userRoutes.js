const express = require("express");
const { register, login ,logout, getUserProfile, checkUserRole } = require("../controllers/userController");
const authUser = require("../middlewares/authUser");


const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);

userRouter.get('/check-user', authUser, checkUserRole);
userRouter.get('/profile', authUser, getUserProfile);


module.exports = userRouter;
