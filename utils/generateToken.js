const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  try {
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h', // token valid for 1 hour
    });
    return token;
  } catch (error) {
    console.error('Token creation failed:', error);
    throw new Error('Token creation failed');
  }
};

module.exports = generateToken;
