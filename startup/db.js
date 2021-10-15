const mongoose = require("mongoose");
const dotenv = require("dotenv");
const winston = require("winston");

dotenv.config();

module.exports = () => {
  mongoose
    .connect(process.env.MONGO_URL_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info("MongoDB Connected"));
};
