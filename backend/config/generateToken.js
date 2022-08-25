const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    const token = process.env.JWT_SECRET;
  return jwt.sign({ id }, token, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;