const jwt = require("jsonwebtoken");


const authUser = (req, res, next) => {
  try {
    const { token } = req.cookies;

    console.log("token", token)
    if (!token) return res.status(401).json({ message: "User not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = authUser;
