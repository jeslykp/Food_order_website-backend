const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  const { username, email, password, role } = req.body || {};
  console.log(username, email, password, role, "===============req");

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  user using the User model
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    // Send response
    return res
      .status(201)
      .json({ message: "User created successfully", savedUser });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    //check user exists
    if (!user) return res.status(400).json({ message: "User does not exist" });

    //check for password match
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    //Generate token
    const token = generateToken(user._id, "user");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });
    const userObject = user.toObject();
    delete userObject.password;

    console.log(userObject, "=========object");
    res.status(200).json({ message: "Login successful", userObject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

 const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

 const checkUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      role: user.role, 
      LoggedInUser:user.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, logout ,getUserProfile,checkUserRole };
