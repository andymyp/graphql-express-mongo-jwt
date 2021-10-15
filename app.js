const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const winston = require("winston");
const bodyParser = require("body-parser");

const { Home } = require("./routes");
const error = require("./middleware/error");

const app = express();
dotenv.config();

require("./startup/db")();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(Home);
app.use(error);

app.listen(process.env.PORT, () => {
  winston.info(`App running on ${process.env.HOST_URL}`);
});
