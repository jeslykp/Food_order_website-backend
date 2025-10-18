const Admin = require('../models/adminModel');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Fill all fields' });

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashedPassword });
    const token = generateToken(admin._id, 'admin');

    res.cookie('token', token, { httpOnly: true, maxAge: 60*60*1000 }).json({ message: 'Admin registered', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid password' });

    const token = generateToken(admin._id, 'admin');
    res.cookie('token', token, { httpOnly: true, maxAge: 60*60*1000 }).json({ message: 'Login successful', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logoutAdmin = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Admin logged out' });
};


module.exports = { registerAdmin, loginAdmin, logoutAdmin};