const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { User } = require("../models");

dotenv.config();

const authentication = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const verified = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      req.user = verified;
    } catch (error) {
      console.log("Invalid token");
    }
  }

  next();
};

const isAdmin = async (id) => {
  const user = await User.findById(id).exec();
  return user.role === "admin" ? true : false;
};

module.exports = {
  authentication,
  isAdmin,
};
